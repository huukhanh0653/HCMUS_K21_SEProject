import React, { Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedChannel } from "../../redux/homeSlice";
import { Hash, Bell } from "lucide-react";
import { useTheme } from "../../components/layout/ThemeProvider";

// Import các component liên quan đến Server
import ServerChannels from "./ServerChannels";
import ServerChat from "./ServerChat/ServerChat";
import ServerMembers from "./ServerMembers";
import UserPanel from "../user/UserPanel";

export default function Server({
  selectedServer,
  user,
  selectedChannel, // Đây chỉ dùng cho các kênh text.
  onChannelSelect,
  setProfileModal,
}) {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  // Dữ liệu channels mẫu với các loại: text và voice.
  const [channels, setChannels] = useState([
    { id: 1, name: "general", type: "text", isPrivate: false },
    { id: 2, name: "announcements", type: "text", isPrivate: false },
    { id: 3, name: "random", type: "text", isPrivate: true },
    { id: 4, name: "Gaming", type: "voice", isPrivate: false },
  ]);

  // Xác định kênh text hiện hành (nếu có)
  const textChannel =
    selectedChannel && selectedChannel.type === "text" ? selectedChannel : null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Cột trái: Sidebar với ServerChannels & UserPanel */}
      <div className="flex flex-col w-60 h-full bg-white border-r border-gray-200 dark:bg-[#2b2d31]">
        <Suspense fallback={<div>Loading Channels...</div>}>
          <ServerChannels
            channels={channels}
            server={selectedServer}
            onChannelSelect={onChannelSelect}
            onProfileClick={() => setProfileModal(true)}
            selectedChannelId={selectedChannel?.id}
          />
        </Suspense>
        <div className="border-t border-gray-200 dark:border-[#2b2d31]">
          <UserPanel user={user} onProfileClick={() => setProfileModal(true)} />
        </div>
      </div>

      {/* Cột giữa: Header và nội dung chính của kênh text */}
      <div className="flex flex-col flex-1 dark:bg-[#313338]">
        {/* Header */}
        <div
          className={`h-12 flex-shrink-0 border-b flex items-center px-4 justify-between cursor-pointer ${
            isDarkMode ? "border-[#232428]" : "border-gray-300"
          }`}
        >
          <div className="flex items-center">
            {textChannel ? (
              <Hash size={20} className="text-gray-400 mr-2" />
            ) : (
              <span className="text-gray-400 mr-2"></span>
            )}
            <span className="font-semibold">
              {textChannel ? textChannel.name : "Select Channel"}
            </span>
          </div>
          <div
            onClick={() => console.log("Notification clicked")}
            className="cursor-pointer"
          >
            <Bell size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Nội dung chính: hiển thị giao diện chat cho channel text */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {textChannel ? (
            <ServerChat channel={textChannel} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Please select a text channel.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cột phải: Danh sách thành viên (chỉ hiển thị nếu đang ở channel text) */}
      {selectedServer && textChannel && (
        <div className="w-60 h-full bg-white border-l border-gray-200 dark:bg-[#2b2d31] overflow-x-hidden overflow-y-auto">
          <ServerMembers />
        </div>
      )}
    </div>
  );
}
