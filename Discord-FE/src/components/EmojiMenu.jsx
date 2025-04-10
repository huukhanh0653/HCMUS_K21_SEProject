import React from "react";

const emojiList = [
  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
  "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗",
];

export default function EmojiMenu({ onSelect, onClose }) {
  return (
    <div
      className="absolute bottom-full mb-2 right-0 bg-white dark:bg-[#2b2d31] p-2 rounded shadow-md z-50"
      style={{ width: "250px" }}
    >
      <div className="grid grid-cols-5 gap-2">
        {emojiList.map((emoji, index) => (
          <button
            key={index}
            className="text-2xl hover:scale-110 transition-transform"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
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
