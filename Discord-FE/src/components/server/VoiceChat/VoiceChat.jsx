import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneCall } from "lucide-react";
import VoiceChatService from "../../../services/VoiceChatService";
import { useSelector, useDispatch } from "react-redux";
import { toggleMute, leaveVoiceChannel } from "../../../redux/homeSlice";

const VoiceChat = ({ user, channel, onLeave }) => {
  const currentUser = user || JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();

  const [users, setUsers] = useState([
    {
      id: currentUser.id,
      avatar: currentUser.avatar,
      username: currentUser.username,
    },
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const voiceChatService = useRef(null);
  const hasJoined = useRef(false);

  const transformUser = (u) => {
    if (u.id) return u;
    return {
      id: u.userId,
      avatar: "/placeholder.svg",
      username: u.userId,
    };
  };

  const updateUsers = (newUsers) => {
    const transformed = newUsers.map(transformUser);
    if (!transformed.some((u) => u.id === currentUser.id)) {
      transformed.push({
        id: currentUser.id,
        avatar: currentUser.avatar,
        username: currentUser.username,
      });
    }
    setUsers(transformed);
  };

  useEffect(() => {
    const join = async () => {
      if (hasJoined.current) return;
      voiceChatService.current = new VoiceChatService();
      voiceChatService.current.onUsersChange = updateUsers;
      voiceChatService.current.onUserJoin = (newUser) => {
        setUsers((prev) => {
          const transformedUser = transformUser(newUser);
          if (!prev.some((u) => u.id === transformedUser.id)) {
            return [...prev, transformedUser];
          }
          return prev;
        });
      };

      const success = await voiceChatService.current.join(currentUser.id, channel.id);
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
  }, [channel, currentUser.id]);

  const toggleMic = () => {
    dispatch(toggleMute());
    setIsMuted((prev) => !prev);
    if (voiceChatService.current) {
      if (!isMuted) {
        voiceChatService.current.mute();
      } else {
        voiceChatService.current.unmute();
      }
    }
  };

  const handleLeave = () => {
    if (voiceChatService.current) {
      dispatch(leaveVoiceChannel());
      voiceChatService.current.leave();
    }
    onLeave();
  };

  return (
    <div className="p-2 border-t border-gray-600 flex flex-col gap-2 text-sm">
      {users.map((u) => (
        <div key={u.socketId || u.id} className="flex items-center gap-2 w-full ml-[3%]">
          <div className="flex items-center gap-2">
            <img src={u.avatar || "/placeholder.svg"} alt={u.username} className="w-8 h-8 rounded-full object-cover" />
            <span className="font-medium">{u.username}</span>
          </div>
          {u.id === currentUser.id && (
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleMic}>
                {isMuted ? <MicOff size={16} className="text-gray-300 hover:text-white" /> : <Mic size={16} className="text-gray-300 hover:text-white" />}
              </button>
              <button onClick={handleLeave}>
                <PhoneCall size={16} className="text-red-500 hover:text-red-400" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoiceChat;
