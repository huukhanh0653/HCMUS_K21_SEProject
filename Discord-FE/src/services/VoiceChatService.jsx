import io from "socket.io-client";

class VoiceChatService {
  constructor() {
    this.socket = null;
    this.peerConnections = {};
    this.localStream = null;
    this.audioElements = {};
    this.onUsersChange = null;
  }

  async join(userId, channel) {
    if (!this.socket || this.socket.disconnected) {
      this.socket = io("http://localhost:8086");
      this.initializeSocketEvents();
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.socket.emit("join", { userId, channel });
      return true;
    } catch (error) {
      console.error("Failed to join voice chat:", error);
      return false;
    }
  }

  initializeSocketEvents() {
    this.socket.on("peers", (peers) => {
      peers.forEach(({ socketId, userId }) => {
        this.connectToPeer(socketId, userId, true);
      });
    });

    this.socket.on("user-joined", ({ socketId, userId }) => {
      this.connectToPeer(socketId, userId, false);
    });

    this.socket.on("signal", async ({ from, data }) => {
      const pc = this.peerConnections[from];
      if (!pc) return;

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.socket.emit("signal", { to: from, data: pc.localDescription });
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });

    this.socket.on("user-left", ({ socketId }) => {
      if (this.peerConnections[socketId]) {
        this.peerConnections[socketId].close();
        delete this.peerConnections[socketId];
        delete this.audioElements[socketId];
      }
      this.updateUsers();
    });
  }

  async connectToPeer(socketId, peerUserId, isInitiator) {
    const pc = new RTCPeerConnection();
    this.peerConnections[socketId] = pc;

    this.localStream.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("signal", { to: socketId, data: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      this.audioElements[socketId] = audio;
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.socket.emit("signal", { to: socketId, data: offer });
    }

    this.updateUsers();
  }

  updateUsers() {
    if (this.onUsersChange) {
      const users = Object.entries(this.peerConnections).map(([socketId, _]) => ({
        socketId,
        userId: socketId // You might want to maintain a mapping of socketId to userId
      }));
      this.onUsersChange(users);
    }
  }

  leave() {
    if (this.socket) {
      this.socket.disconnect();
    }
    Object.values(this.peerConnections).forEach(pc => pc.close());
    this.peerConnections = {};
    this.audioElements = {};
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
}

export default VoiceChatService;
