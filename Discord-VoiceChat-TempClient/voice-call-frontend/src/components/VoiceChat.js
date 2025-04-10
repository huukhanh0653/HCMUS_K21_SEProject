import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with server IP if remote

const VoiceChat = ({ userId, channel, onLeave }) => {
  const [users, setUsers] = useState([]);
  const peerConnections = useRef({});
  const localStream = useRef();
  const audioElements = useRef({});
  const containerRef = useRef();

  useEffect(() => {
    const join = async () => {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      socket.emit("join", { userId, channel });
    };

    join();

    socket.on("peers", (peers) => {
      peers.forEach(({ socketId, userId }) => {
        connectToPeer(socketId, userId, true);
      });
    });

    socket.on("user-joined", ({ socketId, userId }) => {
      connectToPeer(socketId, userId, false);
    });

    socket.on("signal", async ({ from, data }) => {
      const pc = peerConnections.current[from];
      if (!pc) return;

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal", { to: from, data: pc.localDescription });
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });

    socket.on("user-left", ({ socketId }) => {
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
        delete audioElements.current[socketId];
      }
      setUsers((u) => u.filter((usr) => usr.socketId !== socketId));
    });

    return () => {
      // Clean up
      Object.values(peerConnections.current).forEach(pc => pc.close());
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      socket.disconnect();
    };
  }, []);

  const connectToPeer = async (socketId, peerUserId, isInitiator) => {
    const pc = new RTCPeerConnection();

    peerConnections.current[socketId] = pc;

    localStream.current.getTracks().forEach(track => {
      pc.addTrack(track, localStream.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { to: socketId, data: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      audioElements.current[socketId] = audio;
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("signal", { to: socketId, data: offer });
    }

    setUsers((prev) => [...prev, { socketId, userId: peerUserId }]);
  };

  const handleLeave = () => {
    socket.disconnect();
    Object.values(peerConnections.current).forEach(pc => pc.close());
    if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
    onLeave();
  };

  return (
    <div ref={containerRef}>
      <h3>Channel: {channel}</h3>
      <p>You are: {userId}</p>
      <button onClick={handleLeave}>Leave Voice Channel</button>
      <ul>
        {users.map((u) => (
          <li key={u.socketId}>{u.userId}</li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceChat;
