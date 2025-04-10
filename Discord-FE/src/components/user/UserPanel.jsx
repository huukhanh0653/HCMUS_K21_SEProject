import { useEffect, useState } from "react";
import { Mic, Headphones, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";

export default function UserPanel({ user, onProfileClick }) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const [username, setUsername] = useState("Unknown");
  const [avatarSrc, setAvatarSrc] = useState("https://via.placeholder.com/40");

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        if (storedUser.username) {
          setUsername(storedUser.username);
        }
        if (storedUser.avatar) {
          setAvatarSrc(storedUser.avatar);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    } else if (user) {
      // Nếu không có trong localStorage, dùng thông tin từ prop user (nếu có)
      if (user.username) {
        setUsername(user.username);
      }
      if (user.avatar) {
        setAvatarSrc(user.avatar);
      }
    }
  }, [user]);

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
        onClick={onProfileClick}
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
          {truncateText(username, 10)}
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
        <Mic
          size={20}
          className={`cursor-pointer ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-800"
          }`}
        />
        <Headphones
          size={20}
          className={`cursor-pointer ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-800"
          }`}
        />
        <Settings
          size={20}
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
