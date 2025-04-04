require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('redis');

// Initialize Redis client
const redis = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

redis.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await redis.connect();
    console.log('Connected to Redis');
})();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Message Schema & Model
// const MessageSchema = new mongoose.Schema({
//     message_id: { type: String, required: true },
//     channel_id: { type: String, required: true },
//     sender_id: { type: String, required: true },
//     content: { type: String, required: true },
//     attachments: { type: Array, default: [] },
//     timestamp: { type: Date, default: Date.now },
//     edited: { type: Boolean, default: false },
//     deleted: { type: Boolean, default: false }
// });

const MessageSchema = new mongoose.Schema({
  server_id: { type: String, required: true }, // add shard key
  message_id: { type: String, required: true, unique: true },
  channel_id: { type: String, required: true }, // shard key
  sender_id: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', MessageSchema);

// Initialize WebSocket Server
const io = new Server(server, {
    cors: {
        origin: '*', // Change this to your frontend URL in production
        methods: ['GET', 'POST'] 
    }
});

// Helper function to cache a message in Redis
const cacheMessageInRedis = async (message) => {
    const redisKey = `channel:${message.channel_id}:message:${message.message_id}`;
    await redis.set(redisKey, JSON.stringify(message), { EX: 60 * 60 * 24 * 15 }); // Cache for 15 days
};

// Updated fetchPaginatedMessages to handle dynamic limit
const fetchPaginatedMessages = async (channelId, lastTimestamp, limit) => {
    const redisKeys = await redis.sendCommand(['KEYS', `channel:${channelId}:message:*`]); // Get all message keys for the channel
    const redisMessages = [];

    for (const redisKey of redisKeys) {
        const message = JSON.parse(await redis.get(redisKey));
        if (message && !message.deleted && new Date(message.timestamp).getTime() < lastTimestamp) {
            redisMessages.push(message);
        }
    }
    redisMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort in ascending order by timestamp
    let paginatedRedisMessages = redisMessages.slice(0, limit);
    paginatedRedisMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort in ascending order by timestamp
    console.log('Fetched from Redis:', paginatedRedisMessages.length);

    if (paginatedRedisMessages.length < limit) {
        console.log('Fetching from MongoDB');
        const remainingLimit = limit - paginatedRedisMessages.length;
        const lastRedisTimestamp = paginatedRedisMessages.length > 0
            ? new Date(paginatedRedisMessages[0].timestamp).getTime()
            : lastTimestamp;

        const mongoMessages = await Message.find({
            channel_id: channelId,
            deleted: false,
            timestamp: { $lt: new Date(lastRedisTimestamp) }
        }).sort({ timestamp: -1 }).limit(remainingLimit); // Fetch from MongoDB in ascending order
        mongoMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort in ascending order by timestamp
        return [...mongoMessages, ...paginatedRedisMessages];
    }

    return paginatedRedisMessages;
};

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for channel join
    socket.on('joinChannel', async (channelId) => {
        // Join the socket room for this channel
        socket.join(channelId);

        // Fetch the first page of messages
        const messages = await fetchPaginatedMessages(channelId, Date.now(), 10);

        // Send previous messages from this channel to the user
        socket.emit('previousMessages', messages);
    });

    // Listen for fetchMoreMessages to load more messages
    socket.on('fetchMoreMessages', async ({ channel_id, lastTimestamp, limit }) => {
        console.log('Fetching more messages:', channel_id, lastTimestamp, limit);
        const messages = await fetchPaginatedMessages(channel_id, lastTimestamp, limit);

        // Send the additional messages to the user
        socket.emit('moreMessages', messages);
    });

    // Listen for new messages
    socket.on('sendMessage', async (data) => {
        if (!data || !data.channel_id || !data.sender_id || !data.content) {
            console.log('Invalid message data:', data);
            return;
        }

        const newMessage = {
          message_id: uuidv4(),
          server_id: data.server_id, // ✅ Thêm dòng này!
          channel_id: data.channel_id,
          sender_id: data.sender_id,
          content: data.content,
          attachments: data.attachments || [],
          timestamp: new Date(),
          edited: false,
          deleted: false,
        };

        // Save message to MongoDB
        await Message.create(newMessage);

        // Cache the message in Redis
        await cacheMessageInRedis(newMessage);

        // Emit the message only to users in this channel
        io.to(data.channel_id).emit('receiveMessage', newMessage);
    });

    // Handle message editing
    socket.on('editMessage', async (data) => {
        if (!data || !data.message_id || !data.content) {
            console.log('Invalid edit data:', data);
            return;
        }

        const redisKey = `channel:${data.channel_id}:message:${data.message_id}`;
        let message = await redis.get(redisKey);

        if (message) {
            // Update in Redis
            message = JSON.parse(message);
            message.content = data.content;
            message.edited = true;
            await redis.set(redisKey, JSON.stringify(message), { EX: 60 * 60 * 24 * 15 }); // Refresh expiration

            // Emit update only to users in this channel
            io.to(message.channel_id).emit('messageUpdated', message);
        } else {
            // Update in MongoDB
            message = await Message.findOneAndUpdate(
                { message_id: data.message_id },
                { content: data.content, edited: true },
                { new: true }
            );

            if (message) {

                // Emit update only to users in this channel
                io.to(message.channel_id).emit('messageUpdated', message);
            }
        }
    });

    // Handle message deletion
    socket.on('deleteMessage', async (data) => {
        if (!data || !data.message_id) {
            console.log('Invalid delete data:', data);
            return;
        }

        const redisKey = `channel:${data.channel_id}:message:${data.message_id}`;
        let message = await redis.get(redisKey);

        if (message) {
            // Update in Redis
            message = JSON.parse(message);
            message.deleted = true;
            await redis.set(redisKey, JSON.stringify(message), { EX: 60 * 60 * 24 * 15 }); // Refresh expiration

            // Emit deletion only to users in this channel
            io.to(message.channel_id).emit('messageDeleted', message);
        } else {
            // Update in MongoDB
            message = await Message.findOneAndUpdate(
                { message_id: data.message_id },
                { deleted: true },
                { new: true }
            );

            if (message) {

                // Emit deletion only to users in this channel
                io.to(message.channel_id).emit('messageDeleted', message);
            }
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Graceful shutdown for Redis and HTTP server
const shutdown = async () => {
    console.log('Shutting down server...');

    // Close Redis client
    if (redis.isOpen) {
        try {
            await redis.quit();
            console.log('Redis client disconnected.');
        } catch (error) {
            console.error('Error disconnecting Redis client:', error);
        }
    }

    // Close HTTP server
    server.close((err) => {
        if (err) {
            console.error('Error closing HTTP server:', err);
        } else {
            console.log('HTTP server closed.');
        }
    });

    // Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }
};

// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
const PORT = process.env.SERVER_PORT || 8082;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
