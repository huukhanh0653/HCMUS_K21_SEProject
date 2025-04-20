import io from "socket.io-client";

const Voice_API = import.meta.env.VITE_VOICE_API;

class VoiceObserverService {
  constructor() {
    this.socket = null;
    this.observedUsers = {}; // { socketId: { userId, isMuted } }
    this.onUsersChange = null;
  }

  connect(userId, channel) {
    if (!this.socket || this.socket.disconnected) {
      this.socket = io(`${Voice_API}`);
      this.initializeSocketEvents();
    }

    this.socket.emit("observe", { userId, channel });
  }

  initializeSocketEvents() {
    // Nhận danh sách ban đầu
    this.socket.on("channel-members", (members) => {
      members.forEach(({ socketId, userId, isMuted }) => {
        this.observedUsers[socketId] = { userId, isMuted };
      });
      this.updateUsers();
    });

    // Khi có người vào
    this.socket.on("user-joined", ({ socketId, userId, isMuted }) => {
      this.observedUsers[socketId] = { userId, isMuted };
      this.updateUsers();
    });

    // Khi có người tắt/bật mic
    this.socket.on("mic-toggled", ({ socketId, userId, isMuted }) => {
      if (this.observedUsers[socketId]) {
        this.observedUsers[socketId].isMuted = isMuted;
      } else {
        this.observedUsers[socketId] = { userId, isMuted };
      }
      this.updateUsers();
    });

    // Khi có người rời đi
    this.socket.on("user-left", ({ socketId }) => {
      delete this.observedUsers[socketId];
      this.updateUsers();
    });
  }

  updateUsers() {
    if (this.onUsersChange) {
      const users = Object.entries(this.observedUsers).map(([socketId, { userId, isMuted }]) => ({
        socketId,
        userId,
        isMuted
      }));
      this.onUsersChange(users);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.observedUsers = {};
  }
}

export default VoiceObserverService;
