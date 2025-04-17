import React, { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Hash, Pin } from "lucide-react";
import { useTheme } from "../../components/layout/ThemeProvider";
import ServerChannels from "./ServerChannels";
import ServerChat from "./ServerChat/ServerChat";
import ServerMembers from "./ServerMembers";
import PinnedMessagesModal from "./PinnedMessagesModal";
import ServerChannelService from "../../services/ServerChannelService";

export default function Server({
  selectedServer,
  user,
  selectedChannel, // Dành cho các kênh text.
  onChannelSelect,
}) {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  const [channels, setChannels] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);

  // 5 pinned messages mẫu
  const pinnedMessages = [
    { id: 1, user: "Alice", message: "Hello, welcome!" },
    { id: 2, user: "Bob", message: "Don't forget to read the rules." },
    { id: 3, user: "Charlie", message: "Meeting at 3 PM." },
    { id: 4, user: "Dana", message: "New updates available." },
    { id: 5, user: "Eve", message: "Check out this cool resource." },
  ];

  // Khi server được chọn hoặc thay đổi, load channels từ API
  useEffect(() => {
    if (!selectedServer?.id) return;

    ServerChannelService.getChannelsByServer(selectedServer.id)
      .then((response) => {
        // API trả về { data: { message, channels: [...] } }
        const apiChannels = response.channels || [];
        // Map về định dạng frontend, dùng camelCase
        const mapped = apiChannels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type,
          isPrivate: ch.is_private,
        }));
        setChannels(mapped);
      })
      .catch((err) => console.error("Failed to load channels", err));
  }, [selectedServer]);

  // Xác định kênh text hiện hành (nếu có)
  const textChannel =
    selectedChannel && selectedChannel.type === "text"
      ? selectedChannel
      : null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar trái */}
      <div className="flex flex-col w-60 h-full bg-white border-r border-gray-200 dark:bg-[#2b2d31]">
        <Suspense fallback={<div>Loading Channels...</div>}>
          <ServerChannels
            server={selectedServer}
            user={user}
            channels={channels}
            onChannelSelect={onChannelSelect}
            selectedChannelId={selectedChannel?.id}
            setChannels={setChannels}
          />
        </Suspense>
      </div>

      {/* Cột giữa: chat */}
      <div className="flex flex-col flex-1 dark:bg-[#313338]">
        <div
          className={`h-12 flex-shrink-0 border-b flex items-center px-4 justify-between cursor-pointer ${
            isDarkMode ? "border-[#232428]" : "border-gray-300"
          }`}>
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
          <div onClick={() => setShowPinModal(true)} className="cursor-pointer">
            <Pin size={20} className="text-gray-400" />
          </div>
        </div>

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

      {/* Sidebar phải: thành viên */}
      {selectedServer && textChannel && (
        <div className="w-60 h-full bg-white border-l border-gray-200 dark:bg-[#2b2d31] overflow-x-hidden overflow-y-auto">
          <ServerMembers />
        </div>
      )}

      {/* Pinned messages modal */}
      {showPinModal && (
        <PinnedMessagesModal
          pinnedMessages={pinnedMessages}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </div>
  );
}
