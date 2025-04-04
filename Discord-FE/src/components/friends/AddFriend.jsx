import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { t } = useTranslation();

  // Giả sử user đang đăng nhập được lưu trong localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const handleSearch = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`http://localhost:8081/api/users/email/${email}`);
      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      if (data) {
        setSearchResult(data);
      } else {
        setSearchResult(null);
        setErrorMessage("No users found with this email.");
      }
    } catch (error) {
      setSearchResult(null);
      setErrorMessage("Error fetching user: " + error.message);
    }
  };

  const handleAddFriend = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      console.log("Current userID:", currentUser._id);
      console.log("Friend ID:", searchResult?._id);

      const response = await fetch("http://localhost:8081/api/friendships/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userID: currentUser._id,       // ID người gửi lời mời
          friendID: searchResult._id     // ID người nhận
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }

      const data = await response.json();
      console.log("Friend request sent:", data);
      setSuccessMessage("Friend request sent successfully!");
    } catch (error) {
      setErrorMessage("Error adding friend: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{t('Add Friend')}</h2>
      <p className="text-sm text-gray-400 mb-4">
        {t('You can find new friends to make with their email')}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("Enter email")}
          className="flex-1 p-2 bg-[#2b2d31] text-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-[#5865f2] text-white rounded hover:bg-[#4752c4] inline-block"
        >
          {t("Find Friend")}
        </button>
      </div>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
      )}

      {/* Thông báo thành công */}
      {successMessage && (
        <div className="mt-2 text-green-500 text-sm">{successMessage}</div>
      )}

      {/* Kết quả tìm kiếm */}
      {searchResult && (
        <div className="mt-4 p-2 bg-[#1e1f22] rounded flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#36393f] rounded-full">
              <img
                src={searchResult.avatar || "/placeholder.svg?height=32&width=32"}
                alt={searchResult.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-300">{searchResult.username}</p>
              <p className="text-gray-500 text-sm">{searchResult.email}</p>
              <p
                className={`text-sm ${
                  searchResult.status === "online" ? "text-green-500" : "text-gray-500"
                }`}
              >
                {searchResult.status || "offline"}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddFriend}
            className="p-2 bg-[#5865f2] text-white rounded hover:bg-[#4752c4] flex items-center justify-center"
            title={t("Add Friend")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm88 
                64H136c-49.7 0-88 40.3-88 88v16c0 8.8 
                7.2 16 16 16h352c8.8 0 16-7.2 
                16-16v-16c0-49.7-40.3-88-88-88zm264-64h-56V136c0-13.3-10.7-24-24-24h-16
                c-13.3 0-24 10.7-24 24v56h-56c-13.3 
                0-24 10.7-24 24v16c0 13.3 10.7 
                24 24 24h56v56c0 13.3 10.7 24
                24 24h16c13.3 0 24-10.7 
                24-24v-56h56c13.3 0 24-10.7 
                24-24v-16c0-13.3-10.7-24-24-24z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
