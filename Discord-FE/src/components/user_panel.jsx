import { useEffect, useState } from "react";
import { Mic, Headphones, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserPanel({ user, onProfileClick }) {
  const { t } = useTranslation();

  const [username, setUsername] = useState("Unknown");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else if (user?.name) {
      setUsername(user.name);
    }
  }, [user]);

  const avatarSrc = user?.avatar || "https://via.placeholder.com/40";

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="p-2 bg-[#232428] flex items-center gap-2">
      <div
        className="w-8 h-8 bg-[#36393f] rounded-full cursor-pointer"
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
          className="text-sm font-semibold text-left"
          title={username} // Hiển thị full khi hover
        >
          {truncateText(username, 10)}
        </div>
        <div className="text-xs text-gray-400 text-left">{t("Online")}</div>
      </div>
      <div className="flex gap-1">
        <Mic
          size={20}
          className="text-gray-400 hover:text-gray-200 cursor-pointer"
        />
        <Headphones
          size={20}
          className="text-gray-400 hover:text-gray-200 cursor-pointer"
        />
        <Settings
          size={20}
          className="text-gray-400 hover:text-gray-200 cursor-pointer"
        />
      </div>
    </div>
  );
}
