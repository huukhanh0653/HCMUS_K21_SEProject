import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MoreVertical,
  MessageSquare,
  Video,
  UserMinus,
  Slash,
} from "lucide-react";
import { useTheme } from "../layout/ThemeProvider";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedFriend, setActiveTab } from "../../redux/homeSlice";

export default function FriendList({
  setActiveTab,
  setSelectedFriend,
  refreshFriends,
}) {
  const { t } = useTranslation();
  const [showMenuForFriend, setShowMenuForFriend] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState("unfriend");
  const [friendToAction, setFriendToAction] = useState(null);
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.home.friends);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Handle Message button
  const handleMessage = (friend) => {
    dispatch(setSelectedFriend(friend.username));
    dispatch(setActiveTab("friend"));
    //console.log("Message friend:", friend);
    // Xử lý mở DM, chuyển tab chat, v.v.
    setSelectedFriend(friend.id);
    setActiveTab("friend");
  };

  // Handle options in the three-dot menu
  const handleOptionClick = (friendId, action) => {
    switch (action) {
      case "video":
        console.log(`Video call with friend: ${friendId}`);
        break;
      case "unfriend":
        setFriendToAction(friendId);
        setShowConfirmModal(true);
        setAction("unfriend");
        break;
      case "block":
        setFriendToAction(friendId);
        setShowConfirmModal(true);
        setAction("block");
        break;
      default:
        break;
    }
    setShowMenuForFriend(null);
  };

  // Call API to unfriend
  const unfriend = async () => {
    try {
      await UserService.removeFriend(currentUser.id, friendToAction);
      toast.success(t("Successfully unfriended friend"));
      // Re-fetch friends to ensure consistency with server
      await refreshFriends();
    } catch (error) {
      console.error("Error during unfriending:", error);
      toast.error(t("Failed to unfriend"));
    } finally {
      setShowConfirmModal(false);
      setFriendToAction(null);
    }
  };

  // Call API to block
  const block = async () => {
    try {
      await UserService.addBlock(currentUser.id, friendToAction);
      toast.success(t("Successfully blocked friend"));
      // Re-fetch friends to ensure consistency with server
      await refreshFriends();
    } catch (error) {
      console.error("Error during blocking:", error);
      toast.error(t("Failed to block"));
    } finally {
      setShowConfirmModal(false);
      setFriendToAction(null);
    }
  };

  // Handle cancellation in modal
  const cancelAction = () => {
    setShowConfirmModal(false);
    setFriendToAction(null);
  };

  // Determine CSS classes for modal based on Dark/Light mode
  const modalContainerClasses = isDarkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-800";

  return (
    <div className="p-4">
      <h2
        className={`text-xl font-semibold mb-2 ${
          isDarkMode ? "text-white" : "text-[#333333]"
        }`}
      >
        {t("Friends")}
      </h2>
      <p
        className={`text-sm mb-4 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {t("Your friends are listed below.")}
      </p>

      {/* Friends list */}
      <div className="flex flex-col gap-2">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className={`p-2 rounded flex justify-between items-center ${
              isDarkMode ? "bg-[#1e1f22]" : "bg-white border border-gray-300"
            }`}
          >
            {/* Friend info */}
            <div className="flex items-center gap-2 w-[60%]">
              <div
                className={`w-8 h-8 rounded-full overflow-hidden ${
                  isDarkMode ? "bg-[#36393f]" : "bg-gray-200"
                }`}
              >
                <img
                  src={friend.avatar || "https://via.placeholder.com/150"}
                  alt={friend.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className={isDarkMode ? "text-gray-300" : "text-[#333333]"}>
                  {friend.username}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {friend.email}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 relative">
              {/* Message button */}
              <button
                className="relative group"
                onClick={() => handleMessage(friend)}
              >
                <MessageSquare
                  size={20}
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t("Message")}
                </span>
              </button>

              {/* Options button */}
              <div className="relative">
                <button
                  className="relative group"
                  onClick={() =>
                    setShowMenuForFriend(
                      showMenuForFriend === friend._id ? null : friend._id
                    )
                  }
                >
                  <MoreVertical
                    size={20}
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  />
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {t("Options")}
                  </span>
                </button>

                {/* Dropdown menu */}
                {showMenuForFriend === friend._id && (
                  <div
                    className={`absolute right-0 top-full mt-2 rounded shadow-md z-10 w-36 ${
                      isDarkMode
                        ? "bg-[#2b2d31] border border-gray-700"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => handleOptionClick(friend._id, "video")}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <Video size={16} className="mr-2" />
                      {t("Video Call")}
                    </button>
                    <button
                      onClick={() => handleOptionClick(friend._id, "unfriend")}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <UserMinus size={16} className="mr-2" />
                      {t("Unfriend")}
                    </button>
                    <button
                      onClick={() => handleOptionClick(friend._id, "block")}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <Slash size={16} className="mr-2" />
                      {t("Block")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className={`${modalContainerClasses} p-4 rounded shadow-md`}>
            <p className="mb-4">
              {t("Are you sure you want to")} {t(action)} {t("this person?")}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelAction}
                className="px-4 py-2 border rounded"
              >
                {t("No")}
              </button>
              <button
                onClick={action === "unfriend" ? unfriend : block}
                className="px-4 py-2 border rounded bg-red-500 text-white"
              >
                {t("Yes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
