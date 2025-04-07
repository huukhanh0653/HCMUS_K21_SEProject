import { useState, useEffect, useRef } from "react";
import { X, LogOut, Camera, User, Lock, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../layout/LanguageProvider";
import { useTheme } from "../layout/ThemeProvider";
import SampleAvt from "../../assets/sample_avatar.svg";
import { getAuth, signOut } from "firebase/auth";

import { User_API } from "../../../apiConfig";

export default function UserProfile({ user, onClose }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || SampleAvt);
  const [wallpaper, setWallpaper] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else if (user?.name) {
      setUsername(user.name);
    }
  }, [user]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User logged out");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("user");
      localStorage.removeItem("user_info");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onClose) {
        if (showEditProfile) {
          setShowEditProfile(false);
        } else if (showChangePassword) {
          setShowChangePassword(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, showEditProfile, showChangePassword]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser._id) {
      alert("Không tìm thấy thông tin người dùng để cập nhật.");
      return;
    }

    const userId = storedUser._id;

    const updatedUser = {
      username: username.trim(),
      email: storedUser.email,
      password: "",
      role: storedUser.role,
      avatar: avatar || "",
    };

    try {
      const res = await fetch(`${User_API}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        throw new Error("Cập nhật thông tin thất bại");
      }

      const responseData = await res.json();
      console.log("✅ User updated:", responseData);

      const newUserData = { ...storedUser, username: updatedUser.username, avatar: updatedUser.avatar };
      localStorage.setItem("user", JSON.stringify(newUserData));
      localStorage.setItem("username", updatedUser.username);

      const usedUserList = JSON.parse(localStorage.getItem("used_user")) || [];
      const updatedUsedUserList = usedUserList.map((acc) =>
        acc.email === updatedUser.email
          ? { ...acc, username: updatedUser.username, photoURL: updatedUser.avatar }
          : acc
      );
      localStorage.setItem("used_user", JSON.stringify(updatedUsedUserList));

      setShowEditProfile(false);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error.message);
      alert("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Changing password");
    setShowChangePassword(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWallpaper(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getTitle = () => {
    if (showEditProfile) {
      return "Edit Profile";
    } else if (showChangePassword) {
      return "Change Password";
    } else {
      return "My Account";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClickOutside}>
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-md overflow-hidden ${
          isDarkMode ? "bg-[#313338] text-gray-100" : "bg-white text-[#333333] shadow-md"
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? "border-[#232428]" : "border-gray-300"}`}>
          <h1 className="text-xl font-bold">{t(getTitle())}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (showEditProfile) {
                  setShowEditProfile(false);
                } else if (showChangePassword) {
                  setShowChangePassword(false);
                } else {
                  onClose();
                }
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-[#2b2d31] hover:bg-[#232428]" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {showEditProfile ? (
          <div className="p-4">
            <form onSubmit={handleSaveProfile}>
              <div className="mb-6">
                <div className="relative mb-6">
                  <div className={`h-24 ${isDarkMode ? "bg-[#9b84b7]" : "bg-gray-300"} rounded-t-md overflow-hidden`}>
                    {wallpaper && (
                      <img src={wallpaper || "/placeholder.svg"} alt="Wallpaper" className="w-full h-full object-cover" />
                    )}
                    <label
                      className={`absolute right-2 bottom-2 w-8 h-8 ${isDarkMode ? "bg-[#313338]" : "bg-gray-200"} rounded-full flex items-center justify-center cursor-pointer`}
                    >
                      <Camera size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleWallpaperChange} />
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative -mt-10">
                      <div
                        className={`w-20 h-20 rounded-full overflow-hidden ${
                          isDarkMode ? "bg-[#36393f] border-4 border-[#232428]" : "bg-gray-200 border-4 border-gray-300"
                        }`}
                      >
                        <img src={avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <label
                        className={`absolute bottom-0 right-0 w-8 h-8 ${isDarkMode ? "bg-[#313338]" : "bg-gray-200"} rounded-full flex items-center justify-center cursor-pointer`}
                      >
                        <Camera size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t("Username")}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                        : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className={`px-4 py-2 rounded-md ${isDarkMode ? "bg-[#2b2d31] hover:bg-[#35373c]" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${isDarkMode ? "bg-[#5865f2] hover:bg-[#4752c4]" : "bg-[#1877F2] hover:bg-[#0D6EFD]"} `}
                >
                  {t("Save Changes")}
                </button>
              </div>
            </form>
          </div>
        ) : showChangePassword ? (
          <div className="p-4">
            <form onSubmit={handleChangePassword}>
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t("Current Password")}</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                        : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t("New Password")}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                        : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t("Confirm new Password")}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                        : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className={`px-4 py-2 rounded-md ${isDarkMode ? "bg-[#2b2d31] hover:bg-[#35373c]" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${isDarkMode ? "bg-[#5865f2] hover:bg-[#4752c4]" : "bg-[#1877F2] hover:bg-[#0D6EFD]"} `}
                >
                  {t("Change Password")}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex">
            {/* Sidebar user settings */}
            <div className={`w-60 p-4 ${isDarkMode ? "bg-[#2b2d31]" : "bg-white border border-gray-300"}`}>
              <div className="mb-8">
                <div className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t("USER SETTINGS")}
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-2 p-2 rounded w-full ${
                    isDarkMode
                      ? "text-[#656262FF] hover:bg-[#2B2B2BFF] hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#333333]"
                  }`}
                >
                  {language === "en" ? "Switch to Vietnamese" : "Chuyển sang Tiếng Anh"}
                </button>
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 p-2 rounded w-full ${
                    isDarkMode
                      ? "text-[#656262FF] hover:bg-[#2B2B2BFF] hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#333333]"
                  }`}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  {isDarkMode ? <span>{t("Change Light Mode")}</span> : <span>{t("Change Dark Mode")}</span>}
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 p-2 rounded w-full ${
                    isDarkMode
                      ? "text-[#ed4245] hover:bg-[#ed4245] hover:text-white"
                      : "text-red-600 hover:bg-red-100 hover:text-red-700"
                  }`}
                >
                  <LogOut size={16} />
                  <span>{t("Logout")}</span>
                </button>
              </div>
            </div>

            {/* Profile overview */}
            <div className="flex-1 p-4">
              <div className={`rounded-md overflow-hidden mb-6 ${isDarkMode ? "bg-[#232428]" : "bg-gray-100 border border-gray-300"}`}>
                <div className={`h-24 ${isDarkMode ? "bg-[#9b84b7]" : "bg-gray-300"}`}>
                  {wallpaper && (
                    <img src={wallpaper || "/placeholder.svg"} alt="Wallpaper" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="px-4 pb-4 relative">
                  <div className="flex justify-between items-end">
                    <div className="flex items-end gap-4">
                      <div
                        className={`w-20 h-20 rounded-full overflow-hidden ${
                          isDarkMode ? "bg-[#36393f] border-4 border-[#232428]" : "bg-gray-200 border-4 border-gray-300"
                        } -mt-10`}
                      >
                        <img src={avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">{username}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className={`flex items-center gap-1 text-sm rounded px-4 py-1 ${
                  isDarkMode ? "bg-[#5865f2] hover:bg-[#4752c4]" : "bg-[#1877F2] hover:bg-[#0D6EFD]"
                } text-white`}
                onClick={() => setShowEditProfile(true)}
              >
                <User size={14} />
                {t("Edit User Profile")}
              </button>

              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-4">{t("Password and Authentication")}</h3>
                <button
                  className={`flex items-center gap-1 mx-auto text-sm rounded px-3 py-2 ${
                    isDarkMode ? "bg-[#5865f2] hover:bg-[#4752c4]" : "bg-[#1877F2] hover:bg-[#0D6EFD]"
                  } text-white`}
                  onClick={() => setShowChangePassword(true)}
                >
                  <Lock size={14} /> {t("Change Password")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
