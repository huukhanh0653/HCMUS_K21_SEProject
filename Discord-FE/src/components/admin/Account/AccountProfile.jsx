import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../layout/ThemeProvider";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import adminAvatar from "../../../assets/admin-avatar.png";
import UserService from "../../../services/UserService";
import StorageService from "../../../services/StorageService";

export default function AccountProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [user, setUser] = useState(
    storedUser || { username: "", email: "", avatar: "" }
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    storedUser?.avatar || adminAvatar
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: t("Image size must be less than 5MB"),
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          avatar: t("Please select an image file"),
        }));
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, avatar: null }));
    } else {
      setAvatarFile(null);
      setAvatarPreview(user.avatar || adminAvatar);
      setErrors((prev) => ({ ...prev, avatar: null }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!user.username.trim()) newErrors.username = t("Username is required");
    if (!user.email.trim()) newErrors.email = t("Email is required");
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      let avatarUrl = user.avatar || "";
      if (avatarFile) {
        const uploadData = await StorageService.uploadFile(avatarFile);
        if (!uploadData.url) throw new Error(t("Failed to upload avatar"));
        avatarUrl = uploadData.url;
      }
      const updatedUserData = {
        username: user.username.trim(),
        email: user.email.trim(),
        avatar: avatarUrl,
      };
      const response = await UserService.updateUser(userId, updatedUserData);
      const updatedUser = response.data;
      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar || adminAvatar);
      setAvatarFile(null);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success(t("Profile updated successfully!"));
      navigate("/admin");
    } catch (error) {
      toast.error(t("Failed to update profile: ") + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-sm sm:max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("Profile Settings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">{t("Loading...")}</div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full overflow-hidden ${
                      isDarkMode
                        ? "bg-[#36393f] border-4 border-[#232428]"
                        : "bg-gray-200 border-4 border-gray-300"
                    }`}
                  >
                    <img
                      src={avatarPreview}
                      alt={t("Avatar")}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => (e.target.src = adminAvatar)}
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
                      aria-label={t("Select avatar")}
                    />
                  </label>
                </div>
              </div>
              {errors.avatar && (
                <div className="text-red-500 text-sm mb-4 text-center">
                  {errors.avatar}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 text-left m-1">
                    {t("Username")}
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={user.username || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.username && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 text-left m-1">
                    {t("Email")}
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={user.email || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full sm:w-1/2 bg-black dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700"
                  >
                    {isLoading ? t("Saving...") : t("Save Changes")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
