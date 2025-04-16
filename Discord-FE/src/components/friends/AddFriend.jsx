import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../layout/ThemeProvider";
import UserService from "../../services/UserService";

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const handleSearch = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await UserService.getUserByEmail(email);
      if (!response) {
        throw new Error("User not found");
      }

      const data = await response;
      if (data) {
        setSearchResult(data);
      } else {
        setSearchResult(null);
        setErrorMessage("No users found with this email.");
      }
    } catch (error) {
      setSearchResult(null);
      setErrorMessage("Error fetching user: " + error.message);
    }
  };

  const handleAddFriend = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await UserService.sendFriendRequest(
        currentUser.id,
        searchResult.id
      );

      if (!response) {
        throw new Error("Failed to send friend request");
      }

      const data = await response;
      console.log("Friend request sent:", data);
      setSuccessMessage("Friend request sent successfully!");
    } catch (error) {
      setErrorMessage("Error adding friend: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{t("Add Friend")}</h2>
      <p className="text-sm mb-4 text-gray-400">
        {t("You can find new friends to make with their email")}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("Enter email")}
          className={`flex-1 p-2 rounded ${
            isDarkMode
              ? "bg-[#2b2d31] text-gray-300"
              : "bg-gray-100 text-[#333333] border border-gray-300"
          }`}
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-1 rounded ${
            isDarkMode
              ? "bg-[#5865f2] text-white hover:bg-[#4752c4]"
              : "bg-[#1877F2] text-white hover:bg-[#0D6EFD]"
          } inline-block`}
        >
          {t("Find Friend")}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="mt-2 text-green-500 text-sm">{successMessage}</div>
      )}

      {searchResult && (
        <div
          className={`mt-4 p-2 rounded flex justify-between items-center ${
            isDarkMode ? "bg-[#1e1f22]" : "bg-gray-100 border border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2 w-[60%]">
            <div
              className={`w-8 h-8 rounded-full ${
                isDarkMode ? "bg-[#36393f]" : "bg-gray-200"
              }`}
            >
              <img
                src={
                  searchResult.avatar || "/placeholder.svg?height=32&width=32"
                }
                alt={searchResult.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-left">
              <p className={isDarkMode ? "text-gray-300" : "text-[#333333]"}>
                {searchResult.username}
              </p>
              <p
                className={
                  isDarkMode ? "text-gray-500 text-sm" : "text-gray-600 text-sm"
                }
              >
                {searchResult.email}
              </p>
              <p
                className={`text-sm ${
                  searchResult.status === "online"
                    ? isDarkMode
                      ? "text-green-500"
                      : "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {searchResult.status || "offline"}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddFriend}
            className={`p-2 rounded flex items-center justify-center ${
              isDarkMode
                ? "bg-[#5865f2] text-white hover:bg-[#4752c4]"
                : "bg-[#1877F2] text-white hover:bg-[#0D6EFD]"
            }`}
            title={t("Add Friend")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path
                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm88 
                64H136c-49.7 0-88 40.3-88 88v16c0 8.8 
                7.2 16 16 16h352c8.8 0 16-7.2 
                16-16v-16c0-49.7-40.3-88-88-88zm264-64h-56V136c0-13.3-10.7-24-24-24h-16
                c-13.3 0-24 10.7-24 24v56h-56c-13.3 
                0-24 10.7-24 24v16c0 13.3 10.7 
                24 24 24h56v56c0 13.3 10.7 24
                24 24h16c13.3 0 24-10.7 
                24-24v-56h56c13.3 0 24-10.7 
                24-24v-16c0-13.3-10.7-24-24-24z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
