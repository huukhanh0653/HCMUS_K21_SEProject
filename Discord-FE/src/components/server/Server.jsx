import React, { Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedChannel } from "../../redux/homeSlice";
import { Hash, Pin } from "lucide-react";
import { useTheme } from "../../components/layout/ThemeProvider";

// Import các component liên quan đến Server
import ServerChannels from "./ServerChannels";
import ServerChat from "./ServerChat/ServerChat";
import ServerMembers from "./ServerMembers";
import UserPanel from "../user/UserPanel";
import PinnedMessagesModal from "./PinnedMessagesModal"; 

export default function Server({
  selectedServer,
  user,
  selectedChannel, // Dành cho các kênh text.
  onChannelSelect,
}) {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  // State để điều khiển modal popup của tin nhắn ghim.
  const [showPinModal, setShowPinModal] = useState(false);

  // Mẫu 5 tin nhắn ghim
  const pinnedMessages = [
    { id: 1, user: "Alice", message: "Hello, welcome!" },
    { id: 2, user: "Bob", message: "Don't forget to read the rules." },
    { id: 3, user: "Charlie", message: "Meeting at 3 PM." },
    { id: 4, user: "Dana", message: "New updates available." },
    { id: 5, user: "Eve", message: "Check out this cool resource." },
  ];

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
            setChannels={setChannels}
          />
        </Suspense>
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
            onClick={() => setShowPinModal(true)}
            className="cursor-pointer"
          >
            <Pin size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Nội dung chính: hiển thị giao diện chat cho kênh text */}
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

      {/* Sử dụng component Popup modal */}
      {showPinModal && (
        <PinnedMessagesModal
          pinnedMessages={pinnedMessages}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </div>
  );
}
