import { io } from "socket.io-client";

class VoiceChatService {
  constructor() {
    this.socket = null;
    this.localStream = null;
    this.peerConnections = {};
    this.audioElements = {};
  }

  initialize() {
    if (!this.socket) {
      this.socket = io("http://localhost:8086");
    }
    return this.socket;
  }

  async joinChannel(userId, channel) {
    if (!this.socket) {
      this.initialize();
    }
    
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.socket.emit("join", { userId, channel });
      return true;
    } catch (error) {
      console.error("Failed to join voice channel:", error);
      return false;
    }
  }

  leaveChannel() {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    Object.values(this.peerConnections).forEach(pc => pc.close());
    this.peerConnections = {};
    this.audioElements = {};
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  async connectToPeer(socketId, peerUserId, isInitiator) {
    const pc = new RTCPeerConnection();
    this.peerConnections[socketId] = pc;

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

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

    return pc;
  }

  removePeer(socketId) {
    if (this.peerConnections[socketId]) {
      this.peerConnections[socketId].close();
      delete this.peerConnections[socketId];
      delete this.audioElements[socketId];
    }
  }

  // Event listeners
  onPeers(callback) {
    this.socket.on("peers", callback);
  }

  onUserJoined(callback) {
    this.socket.on("user-joined", callback);
  }

  onSignal(callback) {
    this.socket.on("signal", callback);
  }

  onUserLeft(callback) {
    this.socket.on("user-left", callback);
  }

  // Cleanup
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getLocalStream() {
    return this.localStream;
  }

  getPeerConnections() {
    return this.peerConnections;
  }

  getAudioElements() {
    return this.audioElements;
  }
}

// Export as singleton
export default new VoiceChatService();
