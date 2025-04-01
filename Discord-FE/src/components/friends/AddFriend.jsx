import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Lưu trữ các lời mời kết bạn
  const [pendingRequests, setPendingRequests] = useState([]);

  const { t } = useTranslation();

  // Giả sử user đang đăng nhập được lưu trong localStorage:
  // {
  //   "_id": "67e58b59171f9075a48afe76",
  //   "username": "New Test17",
  //   "email": "test15@gmail.com",
  //   ... 
  // }
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Listener: mỗi 5 giây gọi API lấy danh sách thư mời kết bạn
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/friendships/requests/${currentUser._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setPendingRequests(data); // data có thể là mảng các lời mời kết bạn
        } else {
          setPendingRequests([]);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    // Gọi ngay khi component mount
    fetchRequests();

    // Lặp lại mỗi 5 giây
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [currentUser._id]);

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

      // Endpoint POST gửi lời mời kết bạn
      const response = await fetch("http://localhost:8081/api/friendships/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userID: currentUser._id,    // ID người gửi lời mời
          friendID: searchResult._id  // ID người nhận
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

  // Xử lý Đồng ý kết bạn
  const handleAcceptRequest = async (requestID) => {
    try {
      await fetch("http://localhost:8081/api/friendships/request/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestID })
      });
      // Sau khi đồng ý, xóa request khỏi danh sách pendingRequests
      setPendingRequests(prev => prev.filter(req => req._id !== requestID));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Xử lý Từ chối kết bạn
  const handleDeclineRequest = async (requestID) => {
    try {
      await fetch("http://localhost:8081/api/friendships/request/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestID })
      });
      // Sau khi từ chối, xóa request khỏi danh sách pendingRequests
      setPendingRequests(prev => prev.filter(req => req._id !== requestID));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Khu vực tìm bạn bè */}
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
                {searchResult.status}
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

      {/* Modal hiển thị lời mời kết bạn (nếu có) */}
      {pendingRequests.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Lấy request đầu tiên để hiển thị */}
          <div className="bg-white text-black rounded p-6 w-[300px] text-center">
            <h3 className="text-lg font-semibold mb-2">
              {pendingRequests[0].sender.username} muốn kết bạn với bạn
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleAcceptRequest(pendingRequests[0]._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Đồng ý
              </button>
              <button
                onClick={() => handleDeclineRequest(pendingRequests[0]._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
