import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import adminAvatar from "../../../assets/admin-avatar.png";
import UserService from "../../../services/UserService";

export default function AccountProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await UserService.getUserByID(userId);
        setUser(userData);
      } catch (error) {
        setError(t("Failed to load user data"));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setError(t("No user ID found"));
      setIsLoading(false);
    }
  }, [userId]);

  const handleInputChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.updateUser(userId, user);
      const updatedUser = response.data;
      setUser(updatedUser);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser })
      );
      toast.success(t("Profile updated successfully!"));
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(t("Failed to update profile"));
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
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 text-sm">
                  <img
                    src={user?.avatar || adminAvatar}
                    alt={t("Avatar")}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => (e.target.src = adminAvatar)}
                  />
                </div>
              </div>

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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 text-left m-1">
                    {t("Avatar URL")}
                  </label>
                  <Input
                    type="url"
                    name="avatar"
                    value={user.avatar || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                    {t("Save Changes")}
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
