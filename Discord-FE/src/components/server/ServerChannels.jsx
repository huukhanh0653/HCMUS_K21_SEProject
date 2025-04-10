import { useEffect, useState, useRef } from "react";
import { ChevronDown, Hash, Volume2, Bell, Plus, Lock } from "lucide-react";
import UserPanel from "../user/UserPanel";
import MemberManagementModal from "./MemberManagementModal";
import ChannelManagementModal from "./ChannelManagementModal";
import InviteServer from "./InviteServer";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";

export default function ServerChannels({ server, onChannelSelect, onProfileClick, selectedChannelId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  // Cập nhật dữ liệu channels có 3 loại: public, private và voice
  const [channels, setChannels] = useState([
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "announcements", type: "text" },
    { id: 3, name: "random", type: "text" },
    { id: 4, name: "Gaming", type: "voice" },
  ]);

  // Dữ liệu member mẫu
  const members = [
    { id: 1, name: "Alice",   avatar: "https://i.pravatar.cc/50?img=1" },
    { id: 2, name: "Bob",     avatar: "https://i.pravatar.cc/50?img=2" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
    { id: 4, name: "Cò",      avatar: "https://i.pravatar.cc/50?img=4" },
    { id: 5, name: "Giang",   avatar: "https://i.pravatar.cc/50?img=5" },
    { id: 6, name: "Bảo",     avatar: "https://i.pravatar.cc/50?img=6" },
    { id: 7, name: "Khánh",   avatar: "https://i.pravatar.cc/50?img=7" },
  ];

  // Trạng thái cho notification của mỗi channel (mặc định bạn có thể set mặc định là "open" nếu cần)
  const [channelNotifications, setChannelNotifications] = useState({});

  // Trạng thái dropdown hiển thị notification (lưu channel id đang mở)
  const [openNotificationDropdown, setOpenNotificationDropdown] = useState(null);

  // Khởi tạo channel public/private đầu tiên nếu chưa có channel nào được chọn
  useEffect(() => {
    if (!selectedChannelId) {
      const firstChannel = channels.find(channel => channel.type !== "voice");
      if (firstChannel) {
        onChannelSelect(firstChannel);
      }
    }
  }, [selectedChannelId, onChannelSelect, channels]);

  const handleChannelClick = (channel) => {
    onChannelSelect(channel);
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* CHANNEL MANAGER FUNCTION */
  const handleDeleteChannel = (channelId) => {
    setChannels(channels.filter(channel => channel.id !== channelId));
  };

  const handleRenameChannel = (channelId, newName) => {
    setChannels(channels.map(channel =>
      channel.id === channelId ? { ...channel, name: newName } : channel
    ));
  };

  const handleCreateChannel = (newName, newType) => {
    const newChannel = { id: Date.now(), name: newName, type: newType };
    setChannels([...channels, newChannel]);
  };

  const handleNotificationChange = (channelId, setting) => {
    setChannelNotifications(prev => ({ ...prev, [channelId]: setting }));
    setOpenNotificationDropdown(null);
    console.log(`Channel ${channelId} notifications set to ${setting}`);
  };

  const getMenuButtonClasses = (option) => {
    if (option === "Delete server") {
      return isDarkMode 
        ? "text-red-500 hover:bg-red-500 hover:text-white"
        : "text-red-500 hover:bg-red-100 hover:text-red-700";
    } else {
      return isDarkMode 
        ? "text-gray-400 hover:bg-[#35373c] hover:text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-[#333333]";
    }
  };

  return (
    <div className={`h-full w-60 flex flex-col relative ${isDarkMode ? "bg-[#2b2d31] text-gray-100" : "bg-white text-[#333333] border-r border-gray-200"}`}>
      {/* Server name header */}
      <div
        className={`h-12 px-4 flex items-center justify-between border-b shadow-sm cursor-pointer relative ${
          isDarkMode ? "border-[#1e1f22] hover:bg-[#35373c]" : "border-gray-300 hover:bg-gray-100"
        }`}
        onClick={toggleMenu}
      >
        <h2 className="font-semibold truncate">{server.label}</h2>
        <ChevronDown size={20} className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div ref={menuRef} className={`absolute top-12 left-0 w-full shadow-md rounded-md overflow-hidden z-10 ${
          isDarkMode ? "bg-[#2b2d31] border border-[#1e1f22]" : "bg-white border border-gray-300"
        }`}>
          {["Manage Members", "Manage Channels", "Invite to server", "Delete server"].map((option, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-2 ${getMenuButtonClasses(option)}`}
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
        members={members} 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)} 
      />

      {/* Channel Management Modal */}
      <ChannelManagementModal
        channels={channels}
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onDeleteChannel={handleDeleteChannel}
        onRenameChannel={handleRenameChannel}
        onCreateChannel={handleCreateChannel}
      />

      {/* Invite Server Modal */}
      <InviteServer
        serverCode="ABC123XYZ" 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />

      {/* Channels list */}
      <div className="flex-1 overflow-y-auto pt-2">
        {channels.map((channel) => (
          <div key={channel.id} className={`flex items-center justify-between px-2 py-1.5 gap-2
            ${isDarkMode 
              ? `text-gray-400 hover:bg-[#35373c] hover:text-gray-200 ${selectedChannelId === channel.id ? "bg-[#35373c] text-white" : ""}`
              : `text-gray-600 hover:bg-gray-100 hover:text-[#333333] ${selectedChannelId === channel.id ? "bg-[#1877F2] text-white" : ""}`
            }`}
          >
            <button onClick={() => handleChannelClick(channel)} className="flex items-center gap-2 flex-1 text-left">
              {channel.type === "voice" ? (
                <Volume2 size={20} />
              ) : channel.type === "private" ? (
                <Lock size={20} />
              ) : (
                <Hash size={20} />
              )}
              <span className="text-sm font-medium">{channel.name}</span>
            </button>
            {channel.type !== "voice" && (
              <div className="flex items-center gap-2">
                {/* Notification bell */}
                <div className="relative">
                  <button onClick={() => setOpenNotificationDropdown(openNotificationDropdown === channel.id ? null : channel.id)}>
                    <Bell size={16} className={`${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#333333]"}`} />
                  </button>
                  {openNotificationDropdown === channel.id && (
                    <div className={`absolute right-0 mt-1 w-32 rounded-md shadow-lg z-20
                      ${isDarkMode ? "bg-[#2b2d31] border border-[#1e1f22]" : "bg-white border border-gray-300"}`}>
                      <button onClick={() => handleNotificationChange(channel.id, "open")} className="block w-full text-left px-2 py-1 hover:bg-gray-200">
                        {t("Mở")}
                      </button>
                      <button onClick={() => handleNotificationChange(channel.id, "mention")} className="block w-full text-left px-2 py-1 hover:bg-gray-200">
                        {t("Chỉ khi nhắc")}
                      </button>
                      <button onClick={() => handleNotificationChange(channel.id, "off")} className="block w-full text-left px-2 py-1 hover:bg-gray-200">
                        {t("Tắt")}
                      </button>
                    </div>
                  )}
                </div>
                {/* Nếu channel là private thì thêm nút plus để thêm member */}
                {channel.type === "private" && (
                  <button onClick={() => console.log("Add member to private channel", channel.id)}>
                    <Plus size={16} className={`${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#333333]"}`} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
