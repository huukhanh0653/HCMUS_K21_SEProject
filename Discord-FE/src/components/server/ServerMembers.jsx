import React from "react";
import { useTheme } from "../layout/ThemeProvider";
import SampleAvt from "../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";

export default function ServerMembers({ serverMembers }) {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();

  // Classes based on theme
  const containerClass = isDarkMode
    ? "bg-[#2b2d31] text-gray-100"
    : "bg-white text-gray-800";
  const headingClass = isDarkMode ? "text-gray-400" : "text-gray-700";
  const userHoverClass = isDarkMode
    ? "hover:bg-[#35373c]"
    : "hover:bg-gray-200";
  const avatarBgClass = isDarkMode ? "bg-[#36393f]" : "bg-gray-300";
  const statusBorderClass = isDarkMode ? "border-[#2b2d31]" : "border-white";
  const userNameClass = isDarkMode ? "text-gray-300" : "text-gray-900";

  // Date formatting options
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  return (
    <div className={`w-60 ${containerClass} flex flex-col overflow-hidden`}>
      <div className="flex-1 overflow-y-auto p-2">
        {serverMembers.map((member) => (
          <div
            key={member.id}
            className={`flex items-center gap-2 px-2 py-1 rounded ${userHoverClass} cursor-pointer`}
          >
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full ${avatarBgClass} overflow-hidden`}
              >
                <img
                  src={member.avatar || SampleAvt}
                  alt={member.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${userNameClass} truncate`}>
                  {member.username}
                </span>
                {member.role === "Owner" && (
                  <span className="text-yellow-500 text-sm">👑</span>
                )}
              </div>
              <span className="text-xs text-gray-400 truncate">
                {t("Joined")}:{" "}
                  {new Date(member.joinedAt).toLocaleDateString(
                    i18n.language,
                    dateOptions
                  )
                }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}