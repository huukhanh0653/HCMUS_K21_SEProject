// UserPanel.jsx
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";

export default function UserPanel({ user, onProfileClick }) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const [username, setUsername] = useState("Unknown");
  const [avatarSrc, setAvatarSrc] = useState("https://via.placeholder.com/40");

  const updateUserInfo = () => {
    // Cố gắng đọc thông tin từ localStorage ("user" hoặc "user_info")
    const storedUserString = localStorage.getItem("user");
    const storedUser_InfoString = localStorage.getItem("user_info");

    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setUsername(storedUser.username || "Unknown");
        setAvatarSrc(storedUser.avatar || "https://via.placeholder.com/40");
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    } else if (storedUser_InfoString) {
      try {
        const storedUser = JSON.parse(storedUser_InfoString);
        setUsername(storedUser.name || "Unknown");
        setAvatarSrc(storedUser.avatar || "https://via.placeholder.com/40");
      } catch (error) {
        console.error("Error parsing stored user_info:", error);
      }
    } else if (user) {
      // Nếu không có trong localStorage, sử dụng thông tin truyền qua props
      setUsername(user.name || "Unknown");
      setAvatarSrc(user.avatar || "https://via.placeholder.com/40");
    }
  };

  // Ban đầu, cập nhật thông tin
  useEffect(() => {
    updateUserInfo();
  }, [user]);

  // Lắng nghe custom event "userUpdated"
  useEffect(() => {
    const handleUserUpdate = () => {
      updateUserInfo();
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  // Hàm cắt bỏ chữ nếu text quá dài
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className={`p-2 flex items-center gap-2 ${
        isDarkMode 
          ? "bg-[#232428]" 
          : "bg-[#F8F9FA] shadow-sm border border-gray-300"
      }`}
    >
      <div
        className={`w-8 h-8 ${isDarkMode ? "bg-[#36393f]" : "bg-gray-200"} rounded-full cursor-pointer`}
      >
        <img
          src={avatarSrc}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div
          className={`text-sm font-semibold text-left ${
            isDarkMode ? "text-white" : "text-[#333333]"
          }`}
          title={username}
        >
          {truncateText(username, 15)}
        </div>
        <div
          className={`text-xs text-left ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("Online")}
        </div>
      </div>
      <div className="flex gap-1">
        <Settings
          size={20}
          onClick={onProfileClick}
          className={`cursor-pointer ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-800"
          }`}
        />
      </div>
    </div>
  );
}
