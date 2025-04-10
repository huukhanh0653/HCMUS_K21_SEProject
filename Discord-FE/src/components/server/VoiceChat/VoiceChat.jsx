import React, { useEffect, useRef, useState } from "react";
import VoiceChatService from "../../../services/VoiceChatService";

const VoiceChat = ({ userId, channel, onLeave }) => {
  const [users, setUsers] = useState([]);
  const voiceChatService = useRef(null);
  const hasJoined = useRef(false);

  useEffect(() => {
    const join = async () => {
      if (hasJoined.current) return;
      
      voiceChatService.current = new VoiceChatService();
      voiceChatService.current.onUsersChange = setUsers;
      
      const success = await voiceChatService.current.join(userId, channel);
      if (success) {
        hasJoined.current = true;
      }
    };

    join();

    return () => {
      if (voiceChatService.current) {
        voiceChatService.current.leave();
      }
      hasJoined.current = false;
    };
  }, [channel, userId]);

  const handleLeave = () => {
    if (voiceChatService.current) {
      voiceChatService.current.leave();
    }
    onLeave();
  };

  return (
    <div>
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
