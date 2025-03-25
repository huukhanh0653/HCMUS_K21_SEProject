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
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
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
const MessageSchema = new mongoose.Schema({
    message_id: { type: String, required: true },
    channel_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    content: { type: String, required: true },
    attachments: { type: Array, default: [] },
    timestamp: { type: Date, default: Date.now },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
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

    redisMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort in ascending order by timestamp
    let paginatedRedisMessages = redisMessages.slice(0, limit);

    if (paginatedRedisMessages.length < limit) {
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
        // Send previous messages from this channel to the user
        // socket.emit('previousMessages', allMessages);
    });

    // Listen for new messages
    socket.on('sendMessage', async (data) => {
        if (!data || !data.channel_id || !data.sender_id || !data.content) {
            console.log('Invalid message data:', data);
            return;
        }

        const newMessage = {
            message_id: uuidv4(),
            channel_id: data.channel_id,
            sender_id: data.sender_id,
            content: data.content,
            attachments: data.attachments || [],
            timestamp: new Date(),
            edited: false,
            deleted: false
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

    // Handle load more messages
    socket.on("loadMessages", async ({ channel_id, limit = 30, before = null }) => {
        console.log(`[loadMessages] channel_id: ${channel_id}, before: ${before}`);
        if (!channel_id) return;
    
        // Fetch messages từ Redis
        const redisKey = `channel:${channel_id}`;
        const redisMessagesRaw = await redis.lRange(redisKey, 0, -1);
        const redisMessages = redisMessagesRaw.map(msg => JSON.parse(msg)).filter(m => !m.deleted);
    
        // Tách logic: nếu có `before`, lọc các message cũ hơn
        let redisFiltered = redisMessages;
        if (before) {
            const beforeDate = new Date(before);
            redisFiltered = redisMessages.filter(m => new Date(m.timestamp) < beforeDate);
        }
    
        // Sort giảm dần để lấy tin mới nhất trong số cũ hơn
        redisFiltered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
        // Cắt ra theo limit
        const selectedRedis = redisFiltered.slice(0, limit);
    
        // Nếu còn thiếu tin nhắn, thì load thêm từ MongoDB
        let selectedMongo = [];
        if (selectedRedis.length < limit) {
            const mongoLimit = limit - selectedRedis.length;
            const mongoQuery = {
                channel_id,
                deleted: false,
                ...(before && { timestamp: { $lt: new Date(before) } })
            };
    
            selectedMongo = await Message.find(mongoQuery)
                .sort({ timestamp: -1 }) // lấy tin mới nhất (trong số cũ hơn)
                .limit(mongoLimit)
                .lean();
        }
    
        const combined = [...selectedRedis, ...selectedMongo]
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sắp lại theo tăng dần
    
        socket.emit("loadedMessages", combined);
        console.log(`[loadedMessages] Sending ${combined.length} messages to client`);
    });
    
});

// Start the server
const PORT = process.env.SERVER_PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
