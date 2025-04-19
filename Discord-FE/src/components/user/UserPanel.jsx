import { useEffect, useState } from "react";
import { Settings, Wifi, Mic, MicOff, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useSelector, useDispatch } from "react-redux";
import { toggleMute, leaveVoiceChannel } from "../../redux/homeSlice";
import SampleAvt from "../../assets/sample_avatar.svg";

export default function UserPanel({ user, onProfileClick }) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("Unknown");
  const [avatarSrc, setAvatarSrc] = useState(SampleAvt);

  // Lấy state voiceChannel & isMuted từ Redux
  const { voiceChannel, isMuted } = useSelector((state) => state.home);

  const updateUserInfo = () => {
    const storedUserString = localStorage.getItem("user");
    const storedUser_InfoString = localStorage.getItem("user_info");

    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setUsername(storedUser.username || "Unknown");
        setAvatarSrc(storedUser.avatar || SampleAvt);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    } else if (storedUser_InfoString) {
      try {
        const storedUser = JSON.parse(storedUser_InfoString);
        setUsername(storedUser.name || "Unknown");
        setAvatarSrc(storedUser.avatar || SampleAvt);
      } catch (error) {
        console.error("Error parsing stored user_info:", error);
      }
    } else if (user) {
      setUsername(user.name || "Unknown");
      setAvatarSrc(user.avatar || SampleAvt);
    }
  };

  useEffect(() => {
    updateUserInfo();
  }, [user]);

  useEffect(() => {
    const handleUserUpdate = () => {
      updateUserInfo();
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleToggleMic = () => {
    dispatch(toggleMute());
  };

  const handleLeaveVoice = () => {
    dispatch(leaveVoiceChannel());
  };

  return (
    <div
      className={`p-2 flex flex-col w-60 ${
        isDarkMode
          ? "bg-[#232428]"
          : "bg-[#F8F9FA] shadow-sm border border-gray-300"
      }`}
      style={{ minHeight: "50px" }}
    >
      {/* Nếu đang ở voiceChannel thì hiển thị block Voice Connected */}
      {voiceChannel && (
        <div
          className={`mt-2 p-2 rounded-md flex flex-col gap-1 ${
            isDarkMode ? "bg-[#2b2d31]" : "bg-white border border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-500">
              {voiceChannel.channelName} / {voiceChannel.serverName}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={handleToggleMic}>
              {isMuted ? (
                <MicOff className="text-gray-400 hover:text-white" size={16} />
              ) : (
                <Mic className="text-gray-400 hover:text-white" size={16} />
              )}
            </button>
            <button onClick={handleLeaveVoice}>
              <PhoneCall
                className="text-red-500 hover:text-red-400"
                size={16}
              />
            </button>
          </div>
        </div>
      )}
      {/* Khối user info */}
      <div className="flex items-center">
        {/* Avatar */}
        <div
          className={`w-8 h-8 ${
            isDarkMode ? "bg-[#36393f]" : "bg-gray-200"
          } rounded-full cursor-pointer`}
        >
          <img
            src={avatarSrc}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Username + Status */}
        <div className="flex-1 ml-2 flex flex-col items-start">
          <div
            className={`text-sm font-semibold ${
              isDarkMode ? "text-white" : "text-[#333333]"
            }`}
            title={username}
          >
            {truncateText(username, 15)}
          </div>
          <div
            className={`text-xs ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            {t("Online")}
          </div>
        </div>

        {/* Settings icon */}
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
    </div>
  );
}
