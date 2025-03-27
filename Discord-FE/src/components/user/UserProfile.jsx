"use client"

import { useState, useEffect, useRef } from "react"
import { X, LogOut, Camera, User, Lock, Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../layout/LanguageProvider";
import { useTheme } from '../layout/ThemeProvider';
import SampleAvt from "../../assets/sample_avatar.svg"
import { getAuth, signOut } from "firebase/auth";

export default function UserProfile({ user, onClose }) {
  // Ligh & Dark mode toggle
  const { isDarkMode, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalRef = useRef(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  // Form states
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState(user?.avatar || SampleAvt)
  const [wallpaper, setWallpaper] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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

      // ✅ Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("user");
      localStorage.removeItem("user_info");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onClose) {
        if (showEditProfile) {
          setShowEditProfile(false)
        } else if (showChangePassword) {
          setShowChangePassword(false)
        } else {
          onClose()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, showEditProfile, showChangePassword])

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose()
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Saving profile:", { username, avatar, wallpaper });
  
    localStorage.setItem("username", username.trim()); // Cập nhật localStorage
    setShowEditProfile(false);
  };
  

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    console.log("Changing password")
    setShowChangePassword(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setWallpaper(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
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
      <div ref={modalRef} className="w-full max-w-2xl bg-[#313338] text-gray-100 rounded-md overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#232428]">
          <h1 className="text-xl font-bold">
            {t(getTitle())}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (showEditProfile) {
                  setShowEditProfile(false)
                } else if (showChangePassword) {
                  setShowChangePassword(false)
                } else {
                  onClose()
                }
              }}
              className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#232428]"
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
                  <div className="h-24 bg-[#9b84b7] rounded-t-md overflow-hidden">
                    {wallpaper && (
                      <img
                        src={wallpaper || "/placeholder.svg"}
                        alt="Wallpaper"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <label className="absolute right-2 bottom-2 w-8 h-8 bg-[#313338] rounded-full flex items-center justify-center cursor-pointer">
                      <Camera size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleWallpaperChange} />
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative -mt-10">
                      <div className="w-20 h-20 rounded-full bg-[#36393f] border-4 border-[#232428] overflow-hidden">
                        <img src={avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#313338] rounded-full flex items-center justify-center cursor-pointer">
                        <Camera size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t('Username')}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 rounded-md bg-[#2b2d31] hover:bg-[#35373c]"
                >
                  {t('Cancel')}
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4]">
                  {t('Save Changes')}
                </button>
              </div>
            </form>
          </div>
        ) : showChangePassword ? (
          <div className="p-4">
            <form onSubmit={handleChangePassword}>
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t('Current Password')}</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t('New Password')}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">{t('Confirm new Password')}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 rounded-md bg-[#2b2d31] hover:bg-[#35373c]"
                >
                  {t('Cancel')}
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4]">
                  {t('Change Password')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex">
            <div className="w-60 bg-[#2b2d31] p-4">
              <div className="mb-8">
                <div className="text-xs font-semibold text-gray-400 mb-2">{t('USER SETTINGS')}</div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-[#656262FF] hover:bg-[#2B2B2BFF] hover:text-white p-2 rounded w-full"
                >
                  {language === "en" ? "Switch to Vietnamese" : "Chuyển sang Tiếng Anh"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-[#656262FF] hover:bg-[#2B2B2BFF] hover:text-white p-2 rounded w-full"
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  {isDarkMode ? <span>{t('Change Light Mode')}</span> : <span>{t('Change Dark Mode')}</span>}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#ed4245] hover:bg-[#ed4245] hover:text-white p-2 rounded w-full"
                >
                  <LogOut size={16} />
                  <span>{t('Logout')}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <div className="bg-[#232428] rounded-md overflow-hidden mb-6">
                <div className="h-24 bg-[#9b84b7]">
                  {wallpaper && (
                    <img src={wallpaper || "/placeholder.svg"} alt="Wallpaper" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="px-4 pb-4 relative">
                  <div className="flex justify-between items-end">
                    <div className="flex items-end gap-4">
                      <div className="w-20 h-20 rounded-full bg-[#36393f] border-4 border-[#232428] -mt-10 overflow-hidden">
                        <img src={avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">{username}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="bg-[#5865f2] text-white px-4 py-1 rounded text-sm flex items-center gap-1"
                onClick={() => setShowEditProfile(true)}
              >
                <User size={14} />
                {t('Edit User Profile')}
              </button>

              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-4">{t('Password and Authentication')}</h3>
                <button
                  className="bg-[#5865f2] text-white px-3 py-2 rounded text-sm flex items-center gap-1 mx-auto"
                  onClick={() => setShowChangePassword(true)}
                >
                  <Lock size={14} /> {t('Change Password')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

