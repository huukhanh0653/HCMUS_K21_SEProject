import { useState, useEffect, useRef } from "react";
import { User, UserMinus, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../layout/ThemeProvider";

export default function FriendContextMenu({ children, friend, onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleAction = (action) => {
    onAction?.(action, friend);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      {isOpen && (
        <div
          ref={menuRef}
          className={`fixed z-50 w-56 rounded-md shadow-lg overflow-hidden ${
            isDarkMode ? "bg-[#232428] border border-[#1e1f22]" : "bg-white border border-gray-300"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translateY(-50%)",
          }}
        >
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
              isDarkMode ? "hover:bg-[#5865f2] hover:text-white" : "hover:bg-gray-100 hover:text-[#333333]"
            }`}
            onClick={() => handleAction("profile")}
          >
            <User size={16} />
            <span>{t("Profile")}</span>
          </div>
          <div className="h-[1px] bg-[#1e1f22] mx-2"></div>
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
              isDarkMode
                ? "text-red-400 hover:bg-red-500 hover:text-white"
                : "text-red-600 hover:bg-red-100 hover:text-red-700"
            }`}
            onClick={() => handleAction("unfriend")}
          >
            <UserMinus size={16} />
            <span>{t("Unfriend")}</span>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
              isDarkMode
                ? "text-red-400 hover:bg-red-500 hover:text-white"
                : "text-red-600 hover:bg-red-100 hover:text-red-700"
            }`}
            onClick={() => handleAction("block")}
          >
            <Ban size={16} />
            <span>{t("Block")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
