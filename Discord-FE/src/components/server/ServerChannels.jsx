import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Hash, Volume2, Bell, Plus, Lock } from "lucide-react";
import MemberManagementModal from "./MemberManagementModal";
import ChannelManagementModal from "./ChannelManagementModal";
import InviteServer from "./InviteServer";
import AddMemberToChannel from "./AddMemberToChannel";
import VoiceChat from "./VoiceChat/VoiceChat";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { joinVoiceChannel } from "../../redux/homeSlice";
import ServerChannelService from "../../services/ServerChannelService";

export default function ServerChannels({
  server,
  channels,
  onChannelSelect,
  selectedChannelId,
  setChannels,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const menuRef = useRef(null);

  // Fetch channels and map snake_case to camelCase
  useEffect(() => {
    if (!server?.id) return;
    ServerChannelService.getChannelsByServer(server.id)
      .then((data) => {
        // 'data' is response.data.data
        const apiChannels = data.channels || [];
        const mapped = apiChannels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type,
          isPrivate: ch.is_private,
        }));
        setChannels(mapped);
      })
      .catch((err) => console.error("Failed to load channels", err));
  }, [server, setChannels]);

  // Ensure channels is always an array
  const safeChannels = Array.isArray(channels) ? channels : [];

  // Redux voice channel
  const voiceChannel = useSelector((state) => state.home.voiceChannel);
  const [joinedVoiceChannelId, setJoinedVoiceChannelId] = useState(null);
  useEffect(() => {
    if (!voiceChannel) setJoinedVoiceChannelId(null);
  }, [voiceChannel]);

  // Tạo mảng thành viên mẫu với 20 người dùng.
  const serverMembers = [
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/50?img=1" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/50?img=2" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
    { id: 4, name: "Cò", avatar: "https://i.pravatar.cc/50?img=4" },
    { id: 5, name: "Giang", avatar: "https://i.pravatar.cc/50?img=5" },
    { id: 6, name: "Bảo", avatar: "https://i.pravatar.cc/50?img=6" },
    { id: 7, name: "Khánh", avatar: "https://i.pravatar.cc/50?img=7" },
    { id: 8, name: "User 8", avatar: "https://i.pravatar.cc/50?img=8" },
    { id: 9, name: "User 9", avatar: "https://i.pravatar.cc/50?img=9" },
    { id: 10, name: "User 10", avatar: "https://i.pravatar.cc/50?img=10" },
    { id: 11, name: "User 11", avatar: "https://i.pravatar.cc/50?img=11" },
    { id: 12, name: "User 12", avatar: "https://i.pravatar.cc/50?img=12" },
    { id: 13, name: "User 13", avatar: "https://i.pravatar.cc/50?img=13" },
    { id: 14, name: "User 14", avatar: "https://i.pravatar.cc/50?img=14" },
    { id: 15, name: "User 15", avatar: "https://i.pravatar.cc/50?img=15" },
    { id: 16, name: "User 16", avatar: "https://i.pravatar.cc/50?img=16" },
    { id: 17, name: "User 17", avatar: "https://i.pravatar.cc/50?img=17" },
    { id: 18, name: "User 18", avatar: "https://i.pravatar.cc/50?img=18" },
    { id: 19, name: "User 19", avatar: "https://i.pravatar.cc/50?img=19" },
    { id: 20, name: "User 20", avatar: "https://i.pravatar.cc/50?img=20" },
  ];

  // Auto-select first text channel
  useEffect(() => {
    if (!selectedChannelId && safeChannels.length) {
      const firstText = safeChannels.find((c) => c.type !== "voice");
      if (firstText) onChannelSelect(firstText);
    }
  }, [safeChannels, selectedChannelId, onChannelSelect]);

  // Handle channel click
  const handleChannelClick = (channel) => {
    if (channel.type === "voice") {
      dispatch(
        joinVoiceChannel({
          serverId: server.id,
          serverName: server.name,
          channelId: channel.id,
          channelName: channel.name,
        })
      );
      setJoinedVoiceChannelId(channel.id);
    } else {
      onChannelSelect(channel);
    }
  };

  const handleLeaveVoiceChannel = () => setJoinedVoiceChannelId(null);

  // Menu & Modals state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedPrivateChannel, setSelectedPrivateChannel] = useState(null);
  const [openNotificationDropdown, setOpenNotificationDropdown] = useState(null);

  // Lấy user info
  const user = JSON.parse(localStorage.getItem("user"));

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CRUD handlers
  const handleDeleteChannel = async (channelId) => {
    try {
      await ServerChannelService.deleteChannel(channelId, user.id);
      setChannels(safeChannels.filter((c) => c.id !== channelId));
    } catch (err) {
      console.error("Failed to delete channel", err);
    }
  };

  const handleRenameChannel = async (channel, newName) => {
    try {
      const updated = await ServerChannelService.updateChannel(
        channel.id,
        user.id,
        { name: newName }
      );
      const mapped = {
        id: channel.id,
        name: newName,
        type: channel.type,
        isPrivate: channel.isPrivate,
      };
      setChannels(
        safeChannels.map((c) => (c.id === channel.id ? mapped : c))
      );
    } catch (err) {
      console.error("Failed to rename channel", err);
    }
  };

  const handleCreateChannel = async (newName, newType) => {
    const payload = {
      name: newName,
      type: newType === "voice" ? "voice" : "text",
      isPrivate: newType === "private",
    };
    try {
      const created = await ServerChannelService.createChannel(
        server.id,
        user.id,
        payload
      );
      // Lấy object channel từ response.data
      const channel = created.channel;
      // Map sang format của frontend
      const mapped = {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        isPrivate: channel.is_private,
      };
      setChannels([...safeChannels, mapped]);
    } catch (err) {
      console.error("Failed to create channel", err);
    }
  };

  const handleNotificationChange = (channelId, setting) => {
    setChannelNotifications((prev) => ({ ...prev, [channelId]: setting }));
    setOpenNotificationDropdown(null);
    console.log(`Channel ${channelId} notifications set to ${setting}`);
  };

  const getMenuButtonClasses = (opt) =>
    opt === "Delete server"
      ? isDarkMode
        ? "text-red-500 hover:bg-red-500 hover:text-white"
        : "text-red-500 hover:bg-red-100 hover:text-red-700"
      : isDarkMode
      ? "text-gray-400 hover:bg-[#35373c] hover:text-white"
      : "text-gray-500 hover:bg-gray-100 hover:text-[#333333]";

  const sortedChannels = [...safeChannels].sort((a, b) =>
    a.type === "voice" && b.type !== "voice" ? 1 : b.type === "voice" ? -1 : 0
  );

  return (
    <div
      className={`pb-16 h-full w-60 flex flex-col relative ${
        isDarkMode
          ? "bg-[#2b2d31] text-gray-100"
          : "bg-white text-[#333333] border-r border-gray-200"
      }`}
    >
      {/* Server header */}
      <div
        ref={menuRef}
        className={`h-12 px-4 flex items-center justify-between border-b shadow-sm cursor-pointer relative ${
          isDarkMode ? "border-[#1e1f22] hover:bg-[#35373c]" : "border-gray-300 hover:bg-gray-100"
        }`}
        onClick={() => setIsMenuOpen((o) => !o)}
      >
        <h2 className="font-semibold truncate">{server.name}</h2>
        <ChevronDown size={20} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`absolute top-12 left-0 w-full shadow-md rounded-md overflow-hidden z-10 ${
            isDarkMode
              ? "bg-[#2b2d31] border border-[#1e1f22]"
              : "bg-white border border-gray-300"
          }`}
        >
          {[
            "Manage Members",
            "Manage Channels",
            "Invite to server",
            "Delete server",
          ].map((option, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-2 ${getMenuButtonClasses(
                option
              )}`}
              onClick={() => {
                if (option === "Manage Members") setIsMemberModalOpen(true);
                if (option === "Manage Channels") setIsChannelModalOpen(true);
                if (option === "Invite to server") setIsInviteModalOpen(true);
              }}
            >
              {t(option)}
            </button>
          ))}
        </div>
      )}

      {/* Member Management Modal */}
      <MemberManagementModal
        members={serverMembers}
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />

      {/* Channel Management Modal */}
      <ChannelManagementModal
        channels={safeChannels}
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onDeleteChannel={handleDeleteChannel}
        onRenameChannel={handleRenameChannel}
        onCreateChannel={handleCreateChannel}
      />

      {/* Invite Server Modal */}
      <InviteServer
        server={server}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      {/* Modal: Add Member to Private Channel */}
      <AddMemberToChannel
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        channel={selectedPrivateChannel}
        members={serverMembers}
      />

      <div className="flex-1 overflow-y-auto pt-2">
        {sortedChannels.map((channel) => (
          <div key={channel.id}>
            <div
              className={`flex items-center justify-between px-2 py-1.5 gap-2 ${
                isDarkMode
                  ? `text-gray-400 hover:bg-[#35373c] hover:text-gray-200 ${
                      selectedChannelId === channel.id ? "bg-[#35373c] text-white" : ""
                    }`
                  : `text-gray-600 hover:bg-gray-100 hover:text-[#333333] ${
                      selectedChannelId === channel.id ? "bg-[#1877F2] text-white" : ""
                    }`
              }`}
            >
              <button
                onClick={() => handleChannelClick(channel)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                {channel.type === "voice" ? (
                  <Volume2 size={20} />
                ) : channel.type === "text" && channel.isPrivate ? (
                  <Lock size={20} />
                ) : (
                  <Hash size={20} />
                )}
                <span className="text-sm font-medium">{channel.name}</span>
              </button>
              {channel.type !== "voice" && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenNotificationDropdown(
                          openNotificationDropdown === channel.id
                            ? null
                            : channel.id
                        )
                      }
                    >
                      <Bell
                        size={16}
                        className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                      />
                    </button>
                    {openNotificationDropdown === channel.id && (
                      <div className="absolute right-0 mt-1 w-32 rounded-md shadow-lg z-20">
                        {["open", "mention", "off"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleNotificationChange(channel.id, opt)}
                            className="block w-full text-left px-2 py-1 hover:bg-gray-200"
                          >
                            {t(
                              opt === "open"
                                ? "Mở"
                                : opt === "mention"
                                ? "Chỉ khi nhắc"
                                : "Tắt"
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {channel.type === "text" && channel.isPrivate && (
                    <button
                      onClick={() => {
                        setSelectedPrivateChannel(channel);
                        setIsAddMemberModalOpen(true);
                      }}
                    >
                      <Plus
                        size={16}
                        className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                      />
                    </button>
                  )}
                </div>
              )}
            </div>
            {channel.type === "voice" && channel.id === joinedVoiceChannelId && (
              <VoiceChat
                user={JSON.parse(localStorage.getItem("user"))}
                channel={channel}
                onLeave={handleLeaveVoiceChannel}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
