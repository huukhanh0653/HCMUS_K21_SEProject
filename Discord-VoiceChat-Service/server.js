// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const channels = {}; // { channelId: [userId, ...] }

io.on("connection", (socket) => {
  let userId;
  let channelId;

  socket.on("join", ({ userId: uid, channel }) => {
    userId = uid;
    channelId = channel;

    socket.join(channelId);
    if (!channels[channelId]) channels[channelId] = [];
    channels[channelId].push({ socketId: socket.id, userId });

    console.log(`User ${userId} joined channel ${channelId}`); // Log user joining

    const peers = channels[channelId].filter(p => p.socketId !== socket.id);

    socket.emit("peers", peers);

    socket.to(channelId).emit("user-joined", {
      socketId: socket.id,
      userId
    });
  });

  socket.on("signal", ({ to, data }) => {
    io.to(to).emit("signal", {
      from: socket.id,
      data
    });
  });

  socket.on("disconnect", () => {
    if (!channelId || !channels[channelId]) return;

    channels[channelId] = channels[channelId].filter(p => p.socketId !== socket.id);
    socket.to(channelId).emit("user-left", { socketId: socket.id });

    console.log(`User ${userId} left channel ${channelId}`); // Log user leaving

    if (channels[channelId].length === 0) {
      delete channels[channelId];
    }
  });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("Server listening on http://0.0.0.0:3000");
  });