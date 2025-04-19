import React, { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import FriendContextMenu from "./FriendContextMenu";
import { useDispatch, useSelector } from "react-redux";

const DMSidebar = ({
  isDarkMode,
  activeTab,
  setActiveTab,
  setShowAddFriend,
  selectedFriend,
  setSelectedFriend,
  friends,
  handleFriendAction,
  getStatusColor,
  user,
}) => {
  const { t } = useTranslation();
  const { pendingRequests } = useSelector((state) => state.home);
  const requestCount = pendingRequests.length;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`h-full w-60 flex flex-col ${
        isDarkMode ? "bg-[#2b2d31]" : "bg-white border-r border-gray-200"
      }`}
    >
      {/* Search Bar */}
      <div className="p-3">
        <div
          className={`rounded-md flex items-center px-2 ${
            isDarkMode
              ? "bg-[#1e1f22]"
              : "bg-white border border-gray-300 shadow-sm"
          }`}
        >
          <input
            type="text"
            placeholder={t("Find or start a conversation")}
            className={`w-full text-sm py-1 focus:outline-none bg-transparent border-none ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="px-2 mb-2">
        <div className="flex flex-col items-start gap-2 mb-2">
          {/* Friends Tab */}
          <button
            className={`w-full px-2 py-1 rounded text-left ${
              activeTab === "friends"
                ? isDarkMode
                  ? "bg-[#5865f2] text-white"
                  : "bg-[#1877F2] text-white"
                : isDarkMode
                ? "text-gray-400 hover:bg-[#35373c]"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("friends");
              setSelectedFriend(null);
              setShowAddFriend(false);
            }}
          >
            {t("Friends")}
          </button>

          {/* Friend Requests Tab with badge */}
          <button
            className={`w-full px-2 py-1 rounded flex justify-between items-center ${
              activeTab === "friend_requests"
                ? isDarkMode
                  ? "bg-[#5865f2] text-white"
                  : "bg-[#1877F2] text-white"
                : isDarkMode
                ? "text-gray-400 hover:bg-[#35373c]"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("friend_requests");
              setShowAddFriend(false);
            }}
          >
            <span>{t("Friend requests")}</span>
            {requestCount > 0 && (
              <span
                className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  isDarkMode
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {requestCount}
              </span>
            )}
          </button>

          {/* Add Friend Tab */}
          <button
            className={`w-full px-2 py-1 rounded text-left flex items-center gap-2 ${
              activeTab === "addfriend"
                ? isDarkMode
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white"
                : isDarkMode
                ? "text-gray-400 hover:bg-[#35373c]"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("addfriend");
              setShowAddFriend(true);
              setSelectedFriend(null);
            }}
          >
            <UserPlus size={16} />
            {t("Add friend")}
          </button>
        </div>
      </div>

      {/* Direct Messages Header */}
      <div
        className={`px-2 text-xs font-semibold text-start ${
          isDarkMode ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {t("Direct Messages")}
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="px-2 py-1">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <FriendContextMenu
                key={index}
                friend={friend}
                onAction={handleFriendAction}
              >
                <div
                  className={`flex items-center gap-2 p-1 rounded cursor-pointer ${
                    selectedFriend === friend.username
                      ? isDarkMode
                        ? "bg-[#35373c]"
                        : "bg-gray-200"
                      : isDarkMode
                      ? "hover:bg-[#35373c]"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedFriend(friend.username);
                    setShowAddFriend(false);
                    setActiveTab("friend");
                  }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-[#36393f]">
                      <img
                        src={friend.avatar || "/placeholder.svg"}
                        alt={friend.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                        isDarkMode ? "border-[#2b2d31]" : "border-white"
                      } ${getStatusColor(friend.status)}`}
                    ></div>
                  </div>
                  <span>{friend.username}</span>
                </div>
              </FriendContextMenu>
            ))
          ) : (
            <div
              className={`px-2 py-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {t("No conversations found")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DMSidebar;
