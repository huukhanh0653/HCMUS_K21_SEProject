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
import toast from "react-hot-toast";

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

  const [serverMembers, setServerMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedPrivateChannel, setSelectedPrivateChannel] = useState(null);
  const [openNotificationDropdown, setOpenNotificationDropdown] =
    useState(null);
  const [joinedVoiceChannelId, setJoinedVoiceChannelId] = useState(null);

  // Lấy user info
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if current user is a non-owner member
  const isMember = serverMembers.some((m) => m.id === user.id);

  // Fetch channels from API
  useEffect(() => {
    if (!server?.id) return;
    ServerChannelService.getChannelsByServer(server.id)
      .then((data) => {
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

  // Fetch server members (exclude owners)
  useEffect(() => {
    const fetchServerMembers = async () => {
      try {
        setIsLoading(true);
        const { members } = await ServerChannelService.searchServerMember(
          server.id
        );
        const filteredMembers = members.filter(
          (member) => member.role !== "Owner"
        );
        setServerMembers(filteredMembers);
      } catch (error) {
        toast.error("Failed to fetch server members");
      } finally {
        setIsLoading(false);
      }
    };
    fetchServerMembers();
  }, [server]);

  // Auto-select first text channel
  useEffect(() => {
    const safeChannels = Array.isArray(channels) ? channels : [];
    if (!selectedChannelId && safeChannels.length) {
      const firstText = safeChannels.find((c) => c.type !== "voice");
      if (firstText) onChannelSelect(firstText);
    }
  }, [channels, selectedChannelId, onChannelSelect]);

  // Handle joining/leaving voice channel
  const voiceChannel = useSelector((state) => state.home.voiceChannel);
  useEffect(() => {
    if (!voiceChannel) setJoinedVoiceChannelId(null);
  }, [voiceChannel]);

  const handleLeaveVoiceChannel = () => setJoinedVoiceChannelId(null);

  // Confirmation & action for leaving server
  const handleLeaveServer = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn rời server này không?");
    if (!confirmed) return;
    try {
      await ServerChannelService.leaveServer(server.id, user.id);
      toast.success("Bạn đã rời server");
      // TODO: redirect or update UI
    } catch (err) {
      toast.error("Không thể rời server");
    }
  };

  // Confirmation & action for deleting server
  const handleDeleteServer = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa server này không? Hành động này không thể hoàn tác."
    );
    if (!confirmed) return;
    try {
      await ServerChannelService.deleteServer(server.id, user.id);
      toast.success("Server đã được xóa");
      // TODO: redirect or update UI
    } catch (err) {
      toast.error("Không thể xóa server");
    }
  };

  // CRUD handlers for channels
  const handleDeleteChannel = async (channelId) => {
    try {
      await ServerChannelService.deleteChannel(channelId, user.id);
      const safe = Array.isArray(channels) ? channels : [];
      setChannels(safe.filter((c) => c.id !== channelId));
    } catch (err) {
      console.error("Failed to delete channel", err);
    }
  };

  const handleRenameChannel = async (channel, newName) => {
    try {
      await ServerChannelService.updateChannel(channel.id, user.id, {
        name: newName,
      });
      const safe = Array.isArray(channels) ? channels : [];
      setChannels(
        safe.map((c) => (c.id === channel.id ? { ...c, name: newName } : c))
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
      const ch = created.channel;
      const mapped = {
        id: ch.id,
        name: ch.name,
        type: ch.type,
        isPrivate: ch.is_private,
      };
      const safe = Array.isArray(channels) ? channels : [];
      setChannels([...safe, mapped]);
    } catch (err) {
      console.error("Failed to create channel", err);
    }
  };

  // Notification settings
  const [channelNotifications, setChannelNotifications] = useState({});
  const handleNotificationChange = (channelId, setting) => {
    setChannelNotifications((prev) => ({ ...prev, [channelId]: setting }));
    setOpenNotificationDropdown(null);
  };

  const getMenuButtonClasses = (opt) =>
    opt === "Delete server" || opt === "Leave server"
      ? isDarkMode
        ? "text-red-500 hover:bg-red-500 hover:text-white"
        : "text-red-500 hover:bg-red-100 hover:text-red-700"
      : isDarkMode
      ? "text-gray-400 hover:bg-[#35373c] hover:text-white"
      : "text-gray-500 hover:bg-gray-100 hover:text-[#333333]";

  if (isLoading) {
    return (
      <div
        className={`h-full w-60 flex items-center justify-center ${
          isDarkMode ? "bg-[#2b2d31]" : "bg-white"
        }`}
      >
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Determine dropdown options based on role
  const menuOptions = isMember
    ? ["Invite to server", "Leave server"]
    : [
        "Manage Members",
        "Manage Channels",
        "Invite to server",
        "Delete server",
      ];

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
          isDarkMode
            ? "border-[#1e1f22] hover:bg-[#35373c]"
            : "border-gray-300 hover:bg-gray-100"
        }`}
        onClick={() => setIsMenuOpen((o) => !o)}
      >
        <h2 className="font-semibold truncate">{server.name}</h2>
        <ChevronDown
          size={20}
          className={isDarkMode ? "text-gray-400" : "text-gray-500"}
        />
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
          {menuOptions.map((option, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-2 ${getMenuButtonClasses(
                option
              )}`}
              onClick={() => {
                if (option === "Manage Members") setIsMemberModalOpen(true);
                if (option === "Manage Channels") setIsChannelModalOpen(true);
                if (option === "Invite to server") setIsInviteModalOpen(true);
                if (option === "Leave server") handleLeaveServer();
                if (option === "Delete server") handleDeleteServer();
              }}
            >
              {t(option)}
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      <MemberManagementModal
        server={server}
        members={serverMembers}
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />
      <ChannelManagementModal
        channels={channels || []}
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onDeleteChannel={handleDeleteChannel}
        onRenameChannel={handleRenameChannel}
        onCreateChannel={handleCreateChannel}
      />
      <InviteServer
        server={server}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
      <AddMemberToChannel
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        channel={selectedPrivateChannel}
        members={serverMembers}
      />

      <div className="flex-1 overflow-y-auto pt-2">
        {[...(channels || [])]
          .sort((a, b) =>
            a.type === "voice" && b.type !== "voice"
              ? 1
              : b.type === "voice"
              ? -1
              : 0
          )
          .map((channel) => (
            <div key={channel.id}>
              <div
                className={`flex items-center justify-between px-2 py-1.5 gap-2 ${
                  isDarkMode
                    ? `text-gray-400 hover:bg-[#35373c] hover:text-gray-200 ${
                        selectedChannelId === channel.id
                          ? "bg-[#35373c] text-white"
                          : ""
                      }`
                    : `text-gray-600 hover:bg-gray-100 hover:text-[#333333] ${
                        selectedChannelId === channel.id
                          ? "bg-[#1877F2] text-white"
                          : ""
                      }`
                }`}
              >
                <button
                  onClick={() => {
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
                  }}
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
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                      </button>
                      {openNotificationDropdown === channel.id && (
                        <div className="absolute right-0 mt-1 w-32 rounded-md shadow-lg z-20 bg-white border border-gray-200">
                          {[
                            { key: "open", label: t("Mở") },
                            { key: "mention", label: t("Chỉ khi nhắc") },
                            { key: "off", label: t("Tắt") },
                          ].map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() =>
                                handleNotificationChange(channel.id, opt.key)
                              }
                              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                            >
                              {opt.label}
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
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {channel.type === "voice" &&
                channel.id === joinedVoiceChannelId && (
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
