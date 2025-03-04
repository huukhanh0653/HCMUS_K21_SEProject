require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

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
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
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

    // Send previous messages to the new user
    Message.find().sort({ timestamp: 1 }).then(messages => {
        socket.emit('previousMessages', messages);
    });

    // Listen for new messages
    socket.on('sendMessage', async (data) => {
        const newMessage = new Message(data);
        await newMessage.save();

        // Broadcast the new message to all clients
        io.emit('receiveMessage', newMessage);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
