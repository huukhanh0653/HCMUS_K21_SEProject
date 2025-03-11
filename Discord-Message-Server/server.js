require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

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

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for channel join
    socket.on('joinChannel', async (channelId) => {
        // Join the socket room for this channel
        socket.join(channelId);
        
        // Send previous messages from this channel to the user
        const messages = await Message.find({ 
            channel_id: channelId,
            deleted: false 
        }).sort({ timestamp: 1 });
        
        socket.emit('previousMessages', messages);
    });

    // Listen for new messages
    socket.on('sendMessage', async (data) => {
        const newMessage = new Message({
            message_id: uuidv4(),
            channel_id: data.channel_id,
            sender_id: data.sender_id,
            content: data.content,
            attachments: data.attachments || [],
            timestamp: new Date(),
            edited: false,
            deleted: false
        });
        
        await newMessage.save();
        // Emit the message only to users in this channel
        io.to(data.channel_id).emit('receiveMessage', newMessage);
    });

    // Handle message editing
    socket.on('editMessage', async (data) => {
        const updatedMessage = await Message.findOneAndUpdate(
            { message_id: data.message_id },
            { 
                content: data.content,
                edited: true,
                attachments: data.attachments || []
            },
            { new: true }
        );
        if (updatedMessage) {
            // Emit update only to users in this channel
            io.to(updatedMessage.channel_id).emit('messageUpdated', updatedMessage);
        }
    });

    // Handle message deletion
    socket.on('deleteMessage', async (data) => {
        const deletedMessage = await Message.findOneAndUpdate(
            { message_id: data.message_id },
            { deleted: true },
            { new: true }
        );
        if (deletedMessage) {
            // Emit deletion only to users in this channel
            io.to(deletedMessage.channel_id).emit('messageDeleted', deletedMessage);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
