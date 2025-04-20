import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../layout/ThemeProvider";
import UserService from "../../services/UserService";

const BlockedFriends = ({ onUnblock }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [blockedFriends, setBlockedFriends] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user")).id;

  // Fetch blocked friends when the component mounts
  useEffect(() => {
    const fetchBlockedFriends = async () => {
      try {
        const data = await UserService.getBlockedFriends(userId);
        setBlockedFriends(data);
      } catch (error) {
        console.error("Failed to fetch blocked friends:", error);
      }
    };
    fetchBlockedFriends();
  }, [userId]);

  const handleUnblock = async (friendId) => {
    try {
      // Remove the block
      await UserService.removeBlock(userId, friendId);

      // Update the blocked friends list
      setBlockedFriends(
        blockedFriends.filter((friend) => friend.id !== friendId)
      );

      // Call the onUnblock callback to refresh the friends list
      if (onUnblock) {
        await onUnblock();
      }

      console.log("Friend unblocked and re-added successfully");
    } catch (error) {
      console.error("Failed to unblock and re-add friend:", error);
    }
  };

  return (
    <div
      className={`flex-1 overflow-y-auto ${
        isDarkMode
          ? "bg-[#313338] text-gray-100"
          : "bg-[#F8F9FA] text-[#333333]"
      }`}
    >
      <div className="p-4">
        <h2
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {t("Blocked Friends")}
        </h2>
        {blockedFriends.length > 0 ? (
          blockedFriends.map((friend, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded mb-2 ${
                isDarkMode
                  ? "bg-[#2b2d31] hover:bg-[#35373c]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-[#36393f]">
                    <img
                      src={friend.avatar || "/placeholder.svg"}
                      alt={friend.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {friend.username}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {friend.email}
                  </p>
                </div>
              </div>
              <button
                className={`text-xs px-3 py-1 rounded ${
                  isDarkMode
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => handleUnblock(friend.id)}
              >
                {t("Unblock")}
              </button>
            </div>
          ))
        ) : (
          <div
            className={`p-4 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("No blocked friends")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedFriends;
