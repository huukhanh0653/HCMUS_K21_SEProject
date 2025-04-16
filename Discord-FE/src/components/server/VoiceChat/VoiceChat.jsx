import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneCall } from "lucide-react";
import VoiceChatService from "../../../services/VoiceChatService";

/**
 * Component VoiceChat sẽ join vào kênh voice theo channel được cung cấp
 * và hiển thị danh sách người dùng trong kênh, với giao diện điều khiển
 * cho user hiện tại (bật/tắt mic, cúp máy).
 *
 * Nếu không truyền prop user, component sẽ lấy user hiện tại từ localStorage.
 * (Lưu ý: Home.jsx sử dụng key "user_info" để lưu user.)
 *
 * @param {object} props
 *   - user: (optional) object của user hiện tại.
 *   - channel: đối tượng channel (ít nhất có thuộc tính id)
 *   - onLeave: callback được gọi khi user “cúp máy” (rời kênh)
 */
const VoiceChat = ({ user, channel, onLeave }) => {
  // Lấy thông tin user hiện tại từ prop hoặc từ localStorage (key "user_info")
  const currentUser = user || JSON.parse(localStorage.getItem("user_info"));

  // Khởi tạo state users với currentUser để đảm bảo currentUser luôn có mặt
  const [users, setUsers] = useState([
    {
      _id: currentUser.id,
      avatar: currentUser.avatar,
      username: currentUser.username,
    },
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const voiceChatService = useRef(null);
  const hasJoined = useRef(false);

  // Hàm biến đổi đối tượng người dùng nhận từ service.
  const transformUser = (u) => {
    if (u.id) return u;
    return {
      _id: u.userId,
      avatar: "/placeholder.svg",
      username: u.userId,
    };
  };

  // Hàm cập nhật danh sách users, đảm bảo currentUser luôn có trong danh sách.
  const updateUsers = (newUsers) => {
    const transformed = newUsers.map(transformUser);
    if (!transformed.some((u) => u.id === currentUser.id)) {
      transformed.push({
        _id: currentUser.id,
        avatar: currentUser.avatar,
        username: currentUser.username,
      });
    }
    setUsers(transformed);
  };

  // Khi join vào voice channel.
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

      const success = await voiceChatService.current.join(
        currentUser.id,
        channel.id
      );
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

  // Hàm bật/tắt mic.
  const toggleMic = () => {
    setIsMuted((prev) => !prev);
    if (voiceChatService.current) {
      if (!isMuted) {
        voiceChatService.current.mute();
      } else {
        voiceChatService.current.unmute();
      }
    }
  };

  // Hàm rời kênh voice (cúp máy).
  const handleLeave = () => {
    if (voiceChatService.current) {
      voiceChatService.current.leave();
    }
    onLeave();
  };

  return (
    <div className="p-2 border-t border-gray-600 flex flex-col gap-2 text-sm">
      {users.map((u) => (
        <div
          key={u.socketId || u.id}
          className="flex items-center gap-2 w-full ml-[3%]"
        >
          {/* Phần bên trái: Avatar và Tên */}
          <div className="flex items-center gap-2">
            <img
              src={u.avatar || "/placeholder.svg"}
              alt={u.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">{u.username}</span>
          </div>
          {/* Phần bên phải: Các nút điều khiển của currentUser */}
          {u.id === currentUser.id && (
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleMic}>
                {isMuted ? (
                  <MicOff
                    size={16}
                    className="text-gray-300 hover:text-white"
                  />
                ) : (
                  <Mic size={16} className="text-gray-300 hover:text-white" />
                )}
              </button>
              <button onClick={handleLeave}>
                <PhoneCall
                  size={16}
                  className="text-red-500 hover:text-red-400"
                />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoiceChat;
