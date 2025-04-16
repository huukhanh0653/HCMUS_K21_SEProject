import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MoreVertical,
  MessageSquare,
  Video,
  UserMinus,
  Slash,
} from "lucide-react";
import { useTheme } from "../layout/ThemeProvider";
import { User_API } from "../../../apiConfig";

export default function FriendList() {
  const { t } = useTranslation();
  const [friends, setFriends] = useState([]);
  const [showMenuForFriend, setShowMenuForFriend] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [friendToUnfriend, setFriendToUnfriend] = useState(null);
  const { isDarkMode } = useTheme();

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch danh sách bạn bè từ API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userID = currentUser.id; // Lấy userID từ localStorage
        const response = await fetch(`${User_API}/api/friends/${userID}`, {
          headers: { accept: "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          const transformed = data.map((friend) => ({
            ...friend,
            status: "online", // hoặc logic khác tùy bạn
          }));
          setFriends(transformed);
        } else {
          console.error("Failed to fetch friends data");
        }
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };

    fetchFriends();
  }, [currentUser.id]);

  // Xử lý nút Message
  const handleMessage = (friend) => {
    console.log("Message friend:", friend);
    // Xử lý mở DM, chuyển tab chat, v.v.
  };

  // Xử lý các option trong menu 3 chấm
  const handleOptionClick = (friendId, action) => {
    switch (action) {
      case "video":
        console.log(`Video call with friend: ${friendId}`);
        break;
      case "unfriend":
        // Hiện modal xác nhận hủy kết bạn
        setFriendToUnfriend(friendId);
        setShowConfirmModal(true);
        break;
      case "block":
        console.log(`Block friend: ${friendId}`);
        break;
      default:
        break;
    }
    setShowMenuForFriend(null);
  };

  // Hàm gọi API DELETE hủy kết bạn
  const unfriend = async () => {
    try {
      const response = await fetch(`${User_API}/api/friends/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          userID: currentUser.id,
          friendID: friendToUnfriend,
        }),
      });
      if (response.ok) {
        console.log(`Successfully unfriended friend: ${friendToUnfriend}`);
        // Cập nhật lại danh sách bạn bè (ví dụ: loại bỏ bạn vừa hủy kết bạn)
        setFriends((prev) =>
          prev.filter((friend) => friend.id !== friendToUnfriend)
        );
      } else {
        console.error("Failed to unfriend");
      }
    } catch (error) {
      console.error("Error during unfriending:", error);
    } finally {
      setShowConfirmModal(false);
      setFriendToUnfriend(null);
    }
  };

  // Hàm xử lý khi người dùng chọn No trong modal
  const cancelUnfriend = () => {
    setShowConfirmModal(false);
    setFriendToUnfriend(null);
  };

  // Xác định các lớp CSS cho modal dựa trên Dark/Light mode
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

      {/* Danh sách bạn bè */}
      <div className="flex flex-col gap-2">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`p-2 rounded flex justify-between items-center ${
              isDarkMode ? "bg-[#1e1f22]" : "bg-white border border-gray-300"
            }`}
          >
            {/* Thông tin bạn bè */}
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

            {/* Các nút hành động */}
            <div className="flex items-center gap-2 relative">
              {/* Nút Message */}
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

              {/* Nút Options */}
              <div className="relative">
                <button
                  className="relative group"
                  onClick={() =>
                    setShowMenuForFriend(
                      showMenuForFriend === friend.id ? null : friend.id
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

                {/* Menu thả xuống */}
                {showMenuForFriend === friend.id && (
                  <div
                    className={`absolute right-0 top-full mt-2 rounded shadow-md z-10 w-36 ${
                      isDarkMode
                        ? "bg-[#2b2d31] border border-gray-700"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => handleOptionClick(friend.id, "video")}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <Video size={16} className="mr-2" />
                      {t("Video Call")}
                    </button>
                    <button
                      onClick={() => handleOptionClick(friend.id, "unfriend")}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <UserMinus size={16} className="mr-2" />
                      {t("Unfriend")}
                    </button>
                    <button
                      onClick={() => handleOptionClick(friend.id, "block")}
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

      {/* Modal xác nhận hủy kết bạn */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className={`${modalContainerClasses} p-4 rounded shadow-md`}>
            <p className="mb-4">
              {t("Are you sure you want to unfriend this person?")}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelUnfriend}
                className="px-4 py-2 border rounded"
              >
                {t("No")}
              </button>
              <button
                onClick={unfriend}
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
