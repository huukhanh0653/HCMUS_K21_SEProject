// EmojiMenu.js
import React, { useState } from "react";
import { emojiGroups } from "../emojiData";

export default function EmojiMenu({ onSelect, onClose }) {
  const groupNames = Object.keys(emojiGroups);
  const [activeGroup, setActiveGroup] = useState(groupNames[0]);

  return (
    <div
      className="absolute bottom-full mb-2 right-0 bg-white dark:bg-[#2b2d31] p-2 rounded shadow-md z-50"
      style={{ width: "250px" }}
    >
      {/* Tabs hiển thị tên nhóm */}
      <div className="flex mb-2 border-b border-gray-300 dark:border-gray-600">
        {groupNames.map((group) => (
          <button
            key={group}
            className={`flex-1 text-xs p-1 ${activeGroup === group ? "font-bold" : "opacity-70"} hover:opacity-100`}
            onClick={() => setActiveGroup(group)}
          >
            {group}
          </button>
        ))}
      </div>
      {/* Lưới emoji của nhóm được chọn */}
      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
        {emojiGroups[activeGroup].map((emoji, index) => (
          <button
            key={index}
            className="hover:scale-110 transition-transform"
            onClick={() => onSelect(emoji)}
          >
            <img src={emoji.url} alt={emoji.name} title={emoji.name} className="w-6 h-6" />
          </button>
        ))}
      </div>
      <button
        className="mt-2 text-xs text-gray-500 hover:underline"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
