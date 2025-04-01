const request = require('supertest');
const { Server } = require('socket.io');
const { createServer } = require('http');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const app = require('./server'); // Assuming the Express app is exported from server.js
const { shutdown } = require('./server'); // Import the shutdown function

let io, serverSocket, clientSocket, redisClient, httpServer; // Declare httpServer to close it later

beforeAll(async () => {
    // Setup Redis client
    redisClient = createClient({
        username: process.env.REDIS_USERNAME || "default",
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },
    });
    await redisClient.connect();

    // Setup WebSocket server
    httpServer = createServer(app); // Assign httpServer here
    io = new Server(httpServer);

    // Wait for the server to start
    await new Promise((resolve) => {
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = require('socket.io-client')(`http://localhost:${port}`);
            resolve();
        });
    });

    // Wait for the clientSocket to connect
    await new Promise((resolve) => {
        clientSocket.on('connect', resolve);
    });
});

afterAll(async () => {
    // Simulate SIGINT signal to trigger shutdown logic
    process.emit('SIGINT');
    // Remove all event listeners from clientSocket
    if (clientSocket) {
        clientSocket.removeAllListeners();
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
    }

    // Remove all event listeners from io
    if (io) {
        io.sockets.sockets.forEach((socket) => socket.removeAllListeners());
        io.removeAllListeners();
        io.close();
    }

    // Close Redis client connection
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.quit();
            console.log('Redis client disconnected.');
        } catch (error) {
            console.error('Error disconnecting Redis client:', error);
        }
    }

    // Close HTTP server
    if (httpServer && httpServer.listening) {
        await new Promise((resolve, reject) => {
            httpServer.close((err) => (err ? reject(err) : resolve()));
        });
        console.log('HTTP server closed.');
    }

    // Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }

});

// Ensure Redis client is properly disconnected in case of errors
process.on('exit', async () => {
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.quit();
            console.log('Redis client disconnected on process exit.');
        } catch (error) {
            console.error('Error during process exit Redis cleanup:', error);
        }
    }
});

// Ensure unhandled rejections are logged
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

describe('Message Server Tests', () => {
    test('should create a new message', async () => {
        const messageData = {
            server_id: 'test-server',
            channel_id: 'test-channel',
            sender_id: 'test-user',
            content: 'Hello, world!',
        };

        clientSocket.emit('sendMessage', messageData);

        clientSocket.on('receiveMessage', (message) => {
            expect(message).toMatchObject({
                server_id: 'test-server',
                channel_id: 'test-channel',
                sender_id: 'test-user',
                content: 'Hello, world!',
            });
        });
    });

    test('should fetch paginated messages', async () => {
        const channelId = 'test-channel';
        const lastTimestamp = Date.now();
        const limit = 10;

        clientSocket.emit('fetchMoreMessages', { channel_id: channelId, lastTimestamp, limit });

        clientSocket.on('moreMessages', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toBeLessThanOrEqual(limit);
        });
    });

    test('should edit a message', async () => {
        const editData = {
            message_id: 'test-message-id',
            channel_id: 'test-channel',
            content: 'Updated content',
        };

        clientSocket.emit('editMessage', editData);

        clientSocket.on('messageUpdated', (message) => {
            expect(message).toMatchObject({
                message_id: 'test-message-id',
                content: 'Updated content',
                edited: true,
            });
        });
    });

    test('should delete a message', async () => {
        const deleteData = {
            message_id: 'test-message-id',
            channel_id: 'test-channel',
        };

        clientSocket.emit('deleteMessage', deleteData);

        clientSocket.on('messageDeleted', (message) => {
            expect(message).toMatchObject({
                message_id: 'test-message-id',
                deleted: true,
            });
        });
    });
});
