const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }
});

const channels = {}; // { channelId: [ { socketId, userId }, ... ] }

io.on("connection", (socket) => {
  let userId;
  let channelId;

  // ========= OBSERVER =========
  socket.on("observe", ({ userId: uid, channel }) => {
    userId = uid;
    channelId = channel;

    const members = channels[channelId] || [];
    socket.emit("channel-members", members); // Gửi danh sách hiện tại

    socket.join(`observe-${channelId}`); // Join observer room riêng
    console.log(`Observer ${userId} is observing channel ${channelId}`);
  });

  // ========= JOIN VOICE =========
  socket.on("join", ({ userId: uid, channel }) => {
    userId = uid;
    channelId = channel;

    socket.join(channelId);

    if (!channels[channelId]) channels[channelId] = [];
    channels[channelId].push({ socketId: socket.id, userId });

    console.log(`User ${userId} joined channel ${channelId}`);

    // Gửi danh sách peers cho người mới
    const peers = channels[channelId].filter(p => p.socketId !== socket.id);
    socket.emit("peers", peers);

    // Gửi cho các thành viên trong kênh
    socket.to(channelId).emit("user-joined", {
      socketId: socket.id,
      userId: userId || "Anonymous",
    });

    // Gửi cho observer
    io.to(`observe-${channelId}`).emit("user-joined", {
      socketId: socket.id,
      userId: userId || "Anonymous",
    });
  });

  // ========= SIGNAL =========
  socket.on("signal", ({ to, data }) => {
    io.to(to).emit("signal", {
      from: socket.id,
      data
    });
  });

  // ========= DISCONNECT =========
  socket.on("disconnect", () => {
    if (!channelId || !channels[channelId]) return;

    channels[channelId] = channels[channelId].filter(p => p.socketId !== socket.id);

    // Gửi cho voice user
    socket.to(channelId).emit("user-left", { socketId: socket.id });

    // Gửi cho observer
    io.to(`observe-${channelId}`).emit("user-left", { socketId: socket.id });

    console.log(`User ${userId} left channel ${channelId}`);

    if (channels[channelId].length === 0) {
      delete channels[channelId];
    }
  });
});

// ========= START SERVER =========
const PORT = process.env.SERVER_PORT || 8086;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
