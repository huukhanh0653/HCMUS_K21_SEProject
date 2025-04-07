import React, { useEffect, useRef, useState } from "react";
import { X, MessageSquare, UserPlus, UserMinus, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../layout/ThemeProvider";

export default function FriendProfile({ friend, onClose, isFriend = true }) {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAction = (action) => {
    console.log(`${action} user:`, friend.name);
    // Handle các hành động: message, unfriend, block, ...
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClickOutside}>
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-md overflow-hidden ${isDarkMode ? "bg-[#313338] text-gray-100" : "bg-white text-[#333333] shadow-md"}`}
      >
        {/* Header */}
        <div className="relative h-60">
          {/* Banner */}
          <div className={`${isDarkMode ? "h-40 bg-[#9b84b7]" : "h-40 bg-gray-300"}`}>
            {friend.wallpaper && (
              <img
                src={friend.wallpaper || "/placeholder.svg"}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-[#2b2d31] hover:bg-[#232428]" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            <X size={20} />
          </button>

          {/* Avatar & Status */}
          <div className="absolute left-6 bottom-0">
            <div
              className={`w-[120px] h-[120px] rounded-full overflow-hidden ${isDarkMode ? "bg-[#36393f] border-8 border-[#313338]" : "bg-gray-200 border-8 border-gray-300"}`}
            >
              <img
                src={friend.avatar || "/placeholder.svg?height=120&width=120"}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-8 ${isDarkMode ? "border-[#313338]" : "border-white"} ${
                friend.status === "online"
                  ? "bg-green-500"
                  : friend.status === "idle"
                  ? "bg-yellow-500"
                  : friend.status === "dnd"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            ></div>
          </div>

          {/* Action buttons */}
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              onClick={() => handleAction("message")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${isDarkMode ? "bg-[#5865f2] hover:bg-[#4752c4] text-white" : "bg-[#1877F2] hover:bg-[#0D6EFD] text-white"}`}
            >
              <MessageSquare size={20} />
              {t('Message')}
            </button>
            {isFriend ? (
              <button
                onClick={() => handleAction("unfriend")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-[#2b2d31] hover:bg-[#ed4245] hover:text-white text-[#ed4245]"
                    : "bg-white border border-red-500 hover:bg-red-500 hover:text-white text-red-500"
                }`}
              >
                <UserMinus size={20} />
                {t('Unfriend')}
              </button>
            ) : (
              <button
                onClick={() => handleAction("add_friend")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${isDarkMode ? "bg-[#248046] hover:bg-[#1a6334] text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                <UserPlus size={20} />
                {t('Add Friend')}
              </button>
            )}
            <button
              onClick={() => handleAction("block")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                isDarkMode
                  ? "bg-[#2b2d31] hover:bg-[#ed4245] hover:text-white text-[#ed4245]"
                  : "bg-white border border-red-500 hover:bg-red-500 hover:text-white text-red-500"
              }`}
            >
              <Ban size={20} />
              {t('Block')}
            </button>
          </div>
        </div>

        {/* User info & Tabs */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">{friend.name}</h2>
          <div className={`border-b mb-4 ${isDarkMode ? "border-[#232428]" : "border-gray-300"}`}>
            <div className="flex gap-4">
              <button
                className={`pb-2 ${activeTab === "about" ? "text-white border-b-2 border-white font-semibold" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                onClick={() => setActiveTab("about")}
              >
                {t('About Me')}
              </button>
              <button
                className={`pb-2 ${activeTab === "mutual_friends" ? "text-white border-b-2 border-white font-semibold" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                onClick={() => setActiveTab("mutual_friends")}
              >
                {t('Mutual Friends')}
              </button>
              <button
                className={`pb-2 ${activeTab === "mutual_servers" ? "text-white border-b-2 border-white font-semibold" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                onClick={() => setActiveTab("mutual_servers")}
              >
                {t('Mutual Servers')}
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="space-y-4">
            {activeTab === "about" && (
              <>
                <div className="flex items-center">
                  <h3 className="text-xs font-semibold uppercase w-32 text-gray-400">
                    {t('Member Since')}:
                  </h3>
                  <p>{friend.memberSince || "N/A"}</p>
                </div>
                {friend.email && (
                  <div className="flex items-center">
                    <h3 className="text-xs font-semibold uppercase w-32 text-gray-400">
                      {t('Email')}:
                    </h3>
                    <p>{friend.email}</p>
                  </div>
                )}
                {friend.phone && (
                  <div className="flex items-center">
                    <h3 className="text-xs font-semibold uppercase w-32 text-gray-400">
                      {t('Phone')}:
                    </h3>
                    <p>{friend.phone}</p>
                  </div>
                )}
              </>
            )}
            {activeTab === "mutual_friends" && <p className="text-gray-400">{t('No mutual friends')}</p>}
            {activeTab === "mutual_servers" && <p className="text-gray-400">{t('No mutual servers')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
