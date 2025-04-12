import React from "react";

// Danh sách emoji với 3 trường: unicode, name, type, và url tới hình ảnh emoji
const emojiList = [
  { unicode: "😀", name: ":grinning:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f600.png" },
  { unicode: "😁", name: ":grin:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f601.png" },
  { unicode: "😂", name: ":joy:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f602.png" },
  { unicode: "🤣", name: ":rofl:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f923.png" },
  { unicode: "😃", name: ":smiley:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f603.png" },
  { unicode: "😄", name: ":smile:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f604.png" },
  { unicode: "😅", name: ":sweatsmile:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f605.png" },
  { unicode: "😆", name: ":laughing:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f606.png" },
  { unicode: "😉", name: ":wink:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f609.png" },
  { unicode: "😊", name: ":blush:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f60a.png" },
  { unicode: "😋", name: ":yum:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f60b.png" },
  { unicode: "😎", name: ":sunglasses:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f60e.png" },
  { unicode: "😍", name: ":hearteyes:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f60d.png" },
  { unicode: "😘", name: ":kiss:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f618.png" },
  { unicode: "🥰", name: ":smilingfacewithhearts:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f970.png" },
  { unicode: "😗", name: ":kissing:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f617.png" },
  { unicode: "😙", name: ":kissingheart:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f619.png" },
  { unicode: "😚", name: ":kissingclosedeyes:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f61a.png" },
  { unicode: "🙂", name: ":slightsmile:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f642.png" },
  { unicode: "🤗", name: ":hugging:", type: "emoji", url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f917.png" }
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
            className="hover:scale-110 transition-transform"
            // Khi người dùng chọn, gọi onSelect và truyền cả đối tượng emoji
            onClick={() => onSelect(emoji)}
          >
            {/* Hiển thị emoji thông qua hình ảnh từ URL */}
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
