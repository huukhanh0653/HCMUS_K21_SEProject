import { useState, useEffect, useRef } from "react";
import { X, LogOut, Camera, User, Lock, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../layout/LanguageProvider";
import { useTheme } from "../layout/ThemeProvider";
import SampleAvt from "../../assets/sample_avatar.svg";
import { getAuth, signOut } from "firebase/auth";
//import { User_API } from "../../../apiConfig";
import StorageService from "../../services/StorageService";
import CryptoJS from "crypto-js";
import { sendPasswordResetEmail } from "firebase/auth";
// Khai báo SECRET_KEY (đảm bảo biến môi trường đã được cấu hình)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
// API base URL from Vite environment
const User_API = import.meta.env.VITE_USER_API;

export default function UserProfile({ user, onClose }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Các state cho form profile
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(SampleAvt);
  const [avatarFile, setAvatarFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [background, setBackground] = useState("");

  // Các state cho Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Lấy thông tin người dùng từ localStorage "user" hoặc từ props
  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser.username) setUsername(storedUser.username);
        if (storedUser.avatar) setAvatar(storedUser.avatar);
        if (storedUser.background) setBackground(storedUser.background);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    } else if (user) {
      if (user.username) setUsername(user.username);
      if (user.avatar) setAvatar(user.avatar);
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
    if (!storedUser || !storedUser.id) {
      alert("Không tìm thấy thông tin người dùng để cập nhật.");
      return;
    }

    const userId = storedUser.id;
    let avatarUrl = avatar;
    let backgroundUrl = background;

    if (avatarFile) {
      try {
        const uploadData = await StorageService.uploadFile(avatarFile);
        avatarUrl = uploadData.url || "";
      } catch (error) {
        console.error("Avatar upload error:", error);
        alert("Avatar upload failed. Please try again.");
        return;
      }
    }

    if (backgroundFile) {
      try {
        const uploadData = await StorageService.uploadFile(backgroundFile);
        backgroundUrl = uploadData.url || "";
      } catch (error) {
        console.error("Background upload error:", error);
        alert("Background upload failed. Please try again.");
        return;
      }
    }

    const updatedUser = {
      username: username.trim(),
      email: storedUser.email,
      avatar: avatarUrl,
      background: backgroundUrl,
      is_admin: storedUser.is_admin,
    };

    try {
      const res = await fetch(`${User_API}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        throw new Error("Cập nhật thông tin thất bại");
      }

      const responseData = await res.json();
      //console.log("✅ User updated:", responseData);

      const newUserData = {
        ...storedUser,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        background: updatedUser.background,
      };
      localStorage.setItem("user", JSON.stringify(newUserData));
      window.dispatchEvent(new Event("userUpdated"));

      const usedUserList = JSON.parse(localStorage.getItem("used_user")) || [];
      const updatedUsedUserList = usedUserList.map((acc) =>
        acc.email === updatedUser.email
          ? {
              ...acc,
              username: updatedUser.username,
              photoURL: updatedUser.avatar,
            }
          : acc
      );
      localStorage.setItem("used_user", JSON.stringify(updatedUsedUserList));

      setShowEditProfile(false);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error.message);
      alert("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
    }
  };

  // Cập nhật lại hàm handleChangePassword theo yêu cầu:
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const storedUserStr = localStorage.getItem("user");

    if (!storedUserStr) {
      alert(t("Không tìm thấy thông tin người dùng trong Storage."));
      return;
    }

    try {
      const storedUser = JSON.parse(storedUserStr); // Parse the string to an object
      // Gửi email đặt lại mật khẩu qua Firebase Auth
      await sendPasswordResetEmail(auth, storedUser.email);

      // Hiển thị thông báo thành công
      alert(
        t(
          "Đã gửi email đặt lại mật khẩu đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư để đặt lại mật khẩu."
        )
      );

      // Đóng form
      setShowChangePassword(false);

      // Xóa các trường mật khẩu
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = t("Có lỗi xảy ra khi gửi email đặt lại mật khẩu.");

      // Xử lý các lỗi phổ biến
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = t("Không tìm thấy người dùng với địa chỉ email này.");
          break;
        case "auth/invalid-email":
          errorMessage = t("Địa chỉ email không hợp lệ.");
          break;
        case "auth/too-many-requests":
          errorMessage = t("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
          break;
        default:
          errorMessage = t("Có lỗi xảy ra: ") + error.message;
      }

      alert(errorMessage);
    }
  };
  //Các hàm xử lý thay đổi file avatar & background
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBackground(e.target.result);
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

  const checkChangePassword = () => {
    const storedUserStr = localStorage.getItem("user");
    if (!storedUserStr) {
      alert("Không tìm thấy thông tin người dùng trong Storage.");
      return;
    }
    const storedUser = JSON.parse(storedUserStr);

    const usedUsers = JSON.parse(localStorage.getItem("used_user")) || [];
    const currentAccount = usedUsers.find(
      (acc) => acc.email === storedUser.email
    );
    if (!currentAccount) {
      alert("Tài khoản của bạn hiện không có chức năng đổi mật khẩu!");
      return;
    } else {
      setShowChangePassword(true);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-md overflow-hidden ${
          isDarkMode
            ? "bg-[#313338] text-gray-100"
            : "bg-white text-[#333333] shadow-md"
        }`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? "border-[#232428]" : "border-gray-300"
          }`}
        >
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
                isDarkMode
                  ? "bg-[#2b2d31] hover:bg-[#232428]"
                  : "bg-gray-200 hover:bg-gray-300"
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
                  <div
                    className={`h-24 ${
                      isDarkMode ? "bg-[#9b84b7]" : "bg-gray-300"
                    } rounded-t-md overflow-hidden`}
                  >
                    {background && (
                      <img
                        src={background || "/placeholder.svg"}
                        alt="Background"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <label
                      className={`absolute right-2 bottom-2 w-8 h-8 ${
                        isDarkMode ? "bg-[#313338]" : "bg-gray-200"
                      } rounded-full flex items-center justify-center cursor-pointer`}
                    >
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBackgroundChange}
                      />
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative -mt-10">
                      <div
                        className={`w-20 h-20 rounded-full overflow-hidden ${
                          isDarkMode
                            ? "bg-[#36393f] border-4 border-[#232428]"
                            : "bg-gray-200 border-4 border-gray-300"
                        }`}
                      >
                        <img
                          src={avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label
                        className={`absolute bottom-0 right-0 w-8 h-8 ${
                          isDarkMode ? "bg-[#313338]" : "bg-gray-200"
                        } rounded-full flex items-center justify-center cursor-pointer`}
                      >
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {t("Username")}
                  </label>
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
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-[#2b2d31] hover:bg-[#35373c]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-[#5865f2] hover:bg-[#4752c4]"
                      : "bg-[#1877F2] hover:bg-[#0D6EFD]"
                  } `}
                >
                  {t("Save Changes")}
                </button>
              </div>
            </form>
          </div>
        ) : showChangePassword ? (
          // Form Request Password Reset Email
          <div className="p-4">
            <form onSubmit={handleChangePassword}>
              <div className="mb-6">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-4`}
                ></p>
                {/* We don't need the current password field anymore */}
                {/* <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                              {t("Current Password")}
                            </label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                                  : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                                }`}
                            />
                          </div> */}
                {/* We also don't need the new password and confirm password fields */}
                {/* <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                              {t("New Password")}
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                                  : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                                }`}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                              {t("Confirm New Password")}
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${isDarkMode
                                  ? "bg-[#1e1f22] border border-[#232428] text-white focus:ring-[#5865f2]"
                                  : "bg-gray-100 border border-gray-300 text-[#333333] focus:ring-[#1877F2]"
                                }`}
                            />
                          </div> */}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-[#2b2d31] hover:bg-[#35373c]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? "bg-[#5865f2] hover:bg-[#4752c4]"
                      : "bg-[#1877F2] hover:bg-[#0D6EFD]"
                  } `}
                >
                  {t("Send Reset Email")}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex">
            {/* Sidebar user settings */}
            <div
              className={`w-60 p-4 ${
                isDarkMode ? "bg-[#2b2d31]" : "bg-white border border-gray-300"
              }`}
            >
              <div className="mb-8">
                <div
                  className={`text-xs font-semibold mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
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
                  {language === "en"
                    ? "Switch to Vietnamese"
                    : "Chuyển sang Tiếng Anh"}
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
                  {isDarkMode ? (
                    <span>{t("Change Light Mode")}</span>
                  ) : (
                    <span>{t("Change Dark Mode")}</span>
                  )}
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
              <div
                className={`rounded-md overflow-hidden mb-6 ${
                  isDarkMode
                    ? "bg-[#232428]"
                    : "bg-gray-100 border border-gray-300"
                }`}
              >
                <div
                  className={`h-24 ${
                    isDarkMode ? "bg-[#9b84b7]" : "bg-gray-300"
                  }`}
                >
                  {background && (
                    <img
                      src={background || "/placeholder.svg"}
                      alt="background"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="px-4 pb-4 relative">
                  <div className="flex justify-between items-end">
                    <div className="flex items-end gap-4">
                      <div
                        className={`w-20 h-20 rounded-full overflow-hidden ${
                          isDarkMode
                            ? "bg-[#36393f] border-4 border-[#232428]"
                            : "bg-gray-200 border-4 border-gray-300"
                        } -mt-10`}
                      >
                        <img
                          src={avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="text-xl font-bold mb-2">{username}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className={`flex items-center gap-1 text-sm rounded px-4 py-1 ${
                  isDarkMode
                    ? "bg-[#5865f2] hover:bg-[#4752c4]"
                    : "bg-[#1877F2] hover:bg-[#0D6EFD]"
                } text-white`}
                onClick={() => setShowEditProfile(true)}
              >
                <User size={14} />
                {t("Edit User Profile")}
              </button>

              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-4">
                  {t("Password and Authentication")}
                </h3>
                <button
                  className={`flex items-center gap-1 mx-auto text-sm rounded px-3 py-2 ${
                    isDarkMode
                      ? "bg-[#5865f2] hover:bg-[#4752c4]"
                      : "bg-[#1877F2] hover:bg-[#0D6EFD]"
                  } text-white`}
                  onClick={() => checkChangePassword()}
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
