"use client"

import { useState, useEffect, useRef } from "react"
import { X, LogOut, Camera, User, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom";
import SampleAvt from "../../assets/sample_avatar.svg"

export default function UserProfile({ onClose }) {
  const navigate = useNavigate();
  const modalRef = useRef(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  // Form states
  const [username, setUsername] = useState("Gengar_B")
  const [avatar, setAvatar] = useState(SampleAvt)
  const [wallpaper, setWallpaper] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogout = () => {
    console.log("Logging out...")
    navigate("/login");
  }

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
    e.preventDefault()
    console.log("Saving profile:", { username, avatar, wallpaper })
    setShowEditProfile(false)
  }

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClickOutside}>
      <div ref={modalRef} className="w-full max-w-2xl bg-[#313338] text-gray-100 rounded-md overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#232428]">
          <h1 className="text-xl font-bold">
            {showEditProfile ? "Edit Profile" : showChangePassword ? "Change Password" : "My Account"}
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
              <span className="text-gray-400 text-sm">ESC</span>
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
                  <label className="block text-sm font-medium mb-2">Username</label>
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
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : showChangePassword ? (
          <div className="p-4">
            <form onSubmit={handleChangePassword}>
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#232428] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
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
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4]">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex">
            <div className="w-60 bg-[#2b2d31] p-4">
              <div className="mb-8">
                <div className="text-xs font-semibold text-gray-400 mb-2">USER SETTINGS</div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#ed4245] hover:bg-[#ed4245] hover:text-white p-2 rounded w-full"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
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
                Edit User Profile
              </button>

              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-4">Password and Authentication</h3>
                <button 
                  className="bg-[#5865f2] text-white px-3 py-2 rounded text-sm flex items-center gap-1 mx-auto" 
                  onClick={() => setShowChangePassword(true)}
                >
                  <Lock size={14} /> Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

