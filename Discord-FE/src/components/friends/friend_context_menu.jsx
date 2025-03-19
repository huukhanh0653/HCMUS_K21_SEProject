"use client"

import { useState, useEffect, useRef } from "react"
import { User, UserMinus, Ban } from "lucide-react"
import { useTranslation } from "react-i18next";
export default function FriendContextMenu({ children, friend, onAction }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)
  const { t } = useTranslation();
  const handleContextMenu = (e) => {
    e.preventDefault()
    setIsOpen(true)
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const handleAction = (action) => {
    onAction?.(action, friend)
    setIsOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close menu when pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return (
    <div onContextMenu={handleContextMenu}>
      {children}

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 w-56 bg-[#232428] border border-[#1e1f22] rounded-md shadow-lg overflow-hidden"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translateY(-50%)",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#5865f2] hover:text-white"
            onClick={() => handleAction("profile")}
          >
            <User size={16} />
            <span>{t('Profile')}</span>
          </div>

          <div className="h-[1px] bg-[#1e1f22] mx-2"></div>

          <div
            className="flex items-center gap-2 px-3 py-2 cursor-pointer text-red-400 hover:bg-red-500 hover:text-white"
            onClick={() => handleAction("unfriend")}
          >
            <UserMinus size={16} />
            <span>{t('Unfriend')}</span>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 cursor-pointer text-red-400 hover:bg-red-500 hover:text-white"
            onClick={() => handleAction("block")}
          >
            <Ban size={16} />
            <span>{t('Block')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

