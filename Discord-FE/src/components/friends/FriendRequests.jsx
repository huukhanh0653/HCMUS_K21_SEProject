import React from "react";
import { useTheme } from "../layout/ThemeProvider";
import { useTranslation } from "react-i18next";

function FriendRequests({ friendRequests, onAccept, onDecline }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h2
        className={`text-xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-[#333333]"
        }`}
      >
        {t("Friend requests list")}
      </h2>
      {friendRequests.length === 0 ? (
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          {t(`There isn't any friend request.`)}
        </p>
      ) : (
        friendRequests.map((request) => (
          <div
            key={request.id}
            className={`flex items-center justify-between p-2 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <span className={isDarkMode ? "text-gray-300" : "text-[#333333]"}>
              {request.sender?.username}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(request.id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t("Accept")}
              </button>
              <button
                onClick={() => onDecline(request.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("Decline")}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendRequests;
