import React, { useEffect, useRef, useState } from "react";
import VoiceObserverService from "../../../services/VoiceObserverService"; // ✅ Import đúng service observer
import { useSelector } from "react-redux";
import UserService from "../../../services/UserService"
import { Mic, MicOff } from "lucide-react"; // ✅ Import đúng icon mic

const VoiceChat = ({ user: currentUser, channel }) => {
  console.log(channel.id);
  const [users, setUsers] = useState([]);
  const observerService = useRef(null);
  const hasConnected = useRef(false);

  const transformUser = async (u) => {
    if (u.id) return u;
    try {
      const user = await UserService.getUserByID(u.userId);
      return {
        id: u.userId,
        avatar: user.avatar || "/placeholder.svg",
        username: user.username || "Unknown",
        isMuted: u.isMuted,
      };
    } catch (err) {
      console.error("Failed to get user:", err);
      return {
        id: u.userId,
        avatar: "/placeholder.svg",
        username: "Unknown",
        isMuted: u.isMuted,
      };
    }
  };
  
  const updateUsers = async (newUsers) => {
    const transformed = await Promise.all(newUsers.map(transformUser));
    setUsers(transformed);
  };
  

  useEffect(() => {
    if (hasConnected.current) return;

    observerService.current = new VoiceObserverService();
    observerService.current.onUsersChange = updateUsers;
    observerService.current.connect(currentUser.id, channel.id);

    hasConnected.current = true;

    return () => {
      if (observerService.current) {
        observerService.current.disconnect();
      }
      hasConnected.current = false;
    };
  }, [channel.id, currentUser.id]);

  return (
    <div className="p-2 border-t border-gray-600 flex flex-col gap-2 text-sm">
      {users.map((u) => (
        <div key={u.socketId || u.id} className="flex items-center gap-2 w-full ml-[3%]">
          <div className="flex items-center gap-2">
            <img
              src={u.avatar || "/placeholder.svg"}
              alt={u.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">{u.username}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
              {u.isMuted ? <MicOff size={16} className="text-gray-300 hover:text-white" /> : <Mic size={16} className="text-gray-300 hover:text-white" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoiceChat;
