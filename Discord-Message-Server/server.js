require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('redis');

// Initialize Redis client with provided configuration
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

// Helper function to push Redis messages to MongoDB
const flushRedisToMongo = async () => {
    const keys = await redis.keys('channel:*');
    for (const key of keys) {
        const messages = await redis.lrange(key, 0, -1);
        const parsedMessages = messages.map((msg) => JSON.parse(msg));
        await Message.insertMany(parsedMessages);
        await redis.del(key);
    }
    console.log('Flushed Redis messages to MongoDB');
};

// Schedule Redis flush every 15 minutes
setInterval(flushRedisToMongo, 15 * 60 * 1000);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for channel join
    socket.on('joinChannel', async (channelId) => {
        // Join the socket room for this channel
        socket.join(channelId);

        // Get messages from Redis
        const redisMessages = await redis.sendCommand(['LRANGE', `channel:${channelId}`, '0', '-1']);
        const parsedRedisMessages = redisMessages.map((msg) => JSON.parse(msg));

        // Get messages from MongoDB
        const mongoMessages = await Message.find({ 
            channel_id: channelId,
            deleted: false 
        }).sort({ timestamp: 1 });

        // Combine and sort messages
        const allMessages = [...parsedRedisMessages, ...mongoMessages].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

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

        // Push message to Redis
        await redis.sendCommand(['RPUSH', `channel:${data.channel_id}`, JSON.stringify(newMessage)]);

        // Emit the message only to users in this channel
        io.to(data.channel_id).emit('receiveMessage', newMessage);
    });

    // Handle message editing
    socket.on('editMessage', async (data) => {
        if (!data || !data.message_id || !data.content) {
            console.log('Invalid edit data:', data);
            return;
        }
        console.log('Editing message:', data);

        const redisKey = `channel:${data.channel_id}`;
        let updatedMessage = null;

        // Check if the message exists in Redis
        const redisMessages = await redis.sendCommand(['LRANGE', redisKey, '0', '-1']);
        for (let i = 0; i < redisMessages.length; i++) {
            const msg = JSON.parse(redisMessages[i]);
            if (msg.message_id === data.message_id) {
                console.log("Found message in Redis");
                msg.content = data.content;
                msg.edited = true;
                msg.attachments = data.attachments || [];
                await redis.sendCommand(['LSET', redisKey, i.toString(), JSON.stringify(msg)]);
                updatedMessage = msg;
                console.log(updatedMessage);
                break;
            }
        }

        // If not found in Redis, update in MongoDB
        if (!updatedMessage) {
            updatedMessage = await Message.findOneAndUpdate(
                { message_id: data.message_id },
                { 
                    content: data.content,
                    edited: true,
                    attachments: data.attachments || []
                },
                { new: true }
            );
        }

        if (updatedMessage) {
            // Emit update only to users in this channel
            io.to(updatedMessage.channel_id).emit('messageUpdated', updatedMessage);
        }
    });

    // Handle message deletion
    socket.on('deleteMessage', async (data) => {
        if (!data || !data.message_id) {
            console.log('Invalid delete data:', data);
            return;
        }

        const redisKey = `channel:${data.channel_id}`;
        let deletedMessage = null;

        // Check if the message exists in Redis
        const redisMessages = await redis.sendCommand(['LRANGE', redisKey, '0', '-1']);
        for (let i = 0; i < redisMessages.length; i++) {
            const msg = JSON.parse(redisMessages[i]);
            if (msg.message_id === data.message_id) {
                msg.deleted = true;
                await redis.sendCommand(['LSET', redisKey, i.toString(), JSON.stringify(msg)]);
                deletedMessage = msg;
                break;
            }
        }

        // If not found in Redis, update in MongoDB
        if (!deletedMessage) {
            deletedMessage = await Message.findOneAndUpdate(
                { message_id: data.message_id },
                { deleted: true },
                { new: true }
            );
        }

        if (deletedMessage) {
            // Emit deletion only to users in this channel
            io.to(deletedMessage.channel_id).emit('messageDeleted', deletedMessage);
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
