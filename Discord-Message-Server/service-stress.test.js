const io = require("socket.io-client");

const TOTAL_CLIENTS = 1000;
const MSG_INTERVAL = 2000; // milliseconds

const SERVER_URL = "http://localhost:5000"; // đổi sang ingress nếu test trên cluster
const clients = [];

for (let i = 0; i < TOTAL_CLIENTS; i++) {
  const socket = io(SERVER_URL, {
    transports: ["websocket"],
    reconnection: false,
  });

  socket.on("connect", () => {
    console.log(`Client ${i} connected: ${socket.id}`);
    setInterval(() => {
      socket.emit("message", `Hello from client ${i}`);
    }, MSG_INTERVAL);
  });

  socket.on("message", (msg) => {
    // Optional: console.log(`Client ${i} received: ${msg}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${i} disconnected: ${reason}`);
  });

  clients.push(socket);
}
