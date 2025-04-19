import io from "socket.io-client";

const Voice_API = import.meta.env.VITE_VOICE_API;

class VoiceChatService {
  constructor() {
    this.socket = null;
    this.peerConnections = {};
    this.localStream = null;
    this.audioElements = {};
    this.peerStates = {}; // { socketId: { userId, isMuted } }

    this.onUsersChange = null;
    this.onMicStatusChange = null;
  }

  async join(userId, channel) {
    if (!this.socket || this.socket.disconnected) {
      this.socket = io(`${Voice_API}`);
      this.initializeSocketEvents();
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.socket.emit("join", { userId, channel });
      this.userId = userId;
      this.channel = channel;
      return true;
    } catch (error) {
      console.error("Failed to join voice chat:", error);
      return false;
    }
  }

  initializeSocketEvents() {
    this.socket.on("peers", (peers) => {
      peers.forEach(({ socketId, userId, isMuted }) => {
        this.peerStates[socketId] = { userId, isMuted };
        this.connectToPeer(socketId, userId, true);
      });
      this.updateUsers();
    });

    this.socket.on("user-joined", ({ socketId, userId, isMuted }) => {
      this.peerStates[socketId] = { userId, isMuted };
      this.connectToPeer(socketId, userId, false);
      this.updateUsers();
    });

    this.socket.on("mic-toggled", ({ socketId, userId, isMuted }) => {
      if (this.peerStates[socketId]) {
        this.peerStates[socketId].isMuted = isMuted;
      } else {
        this.peerStates[socketId] = { userId, isMuted };
      }

      if (this.onMicStatusChange) {
        this.onMicStatusChange(socketId, isMuted);
      }

      this.updateUsers();
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
      }
      delete this.audioElements[socketId];
      delete this.peerStates[socketId];
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
  }

  updateUsers() {
    if (this.onUsersChange) {
      const users = Object.entries(this.peerStates).map(([socketId, { userId, isMuted }]) => ({
        socketId,
        userId,
        isMuted
      }));
      this.onUsersChange(users);
    }
  }

  /**
   * Bật/tắt mic và gửi sự kiện toggle lên server
   * @param {boolean} isMuted
   */
  toggleMic(isMuted) {
    if (!this.localStream || !this.socket) return;
    this.localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);

    this.socket.emit("toggle-mic", {
      userId: this.userId,
      channel: this.channel,
      isMuted
    });
  }

  leave() {
    if (this.socket) {
      this.socket.disconnect();
    }
    Object.values(this.peerConnections).forEach(pc => pc.close());
    this.peerConnections = {};
    this.audioElements = {};
    this.peerStates = {};
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
}

export default VoiceChatService;
