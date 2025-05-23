import React, { useState, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import UploadFile from "./UploadFile";
import ShowFile from "./ShowFile";
import { useTheme } from "../../../layout/ThemeProvider";
import EmojiMenu from "../../../EmojiMenu";
import { emojiGroups } from "../../../../emojiData";
import StorageService from "../../../../services/StorageService"

export default function MessageInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
  t,
  friend,
  inputRef,
  files,
  setFiles,
}) {
  
  const { isDarkMode } = useTheme();
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);

  // Gợi ý emoji
  const allEmojis = Object.values(emojiGroups).flat();
  const [emojiSuggestions, setEmojiSuggestions] = useState([]);

  // Thêm/xóa file object vào state
  const handleFileSelect = (file) => setFiles(prev => [...prev, file]);
  const handleRemoveFile = (fileName) => setFiles(prev => prev.filter(f => f.name !== fileName));

  // Kiểm tra từ khóa emoji xuất hiện ở cuối messageInput
  const checkEmojiKeyword = (text) => {
    const match = text.match(/(:\w*)$/);
    if (match) {
      const keyword = match[1].toLowerCase();
      const suggestions = allEmojis.filter((emoji) =>
        emoji.name.toLowerCase().startsWith(keyword)
      );
      setEmojiSuggestions(suggestions);
    } else {
      setEmojiSuggestions([]);
    }
  };

  // Cập nhật gợi ý mỗi khi messageInput thay đổi
  useEffect(() => { checkEmojiKeyword(messageInput); }, [messageInput]);

  const handleKeyDown = (e) => {
    // Khi nhấn TAB và có gợi ý emoji, thực hiện autocomplete
    if (e.key === "Tab" && emojiSuggestions.length > 0) {
      e.preventDefault();
      const selectedEmoji = emojiSuggestions[0]; // Auto chọn emoji đầu tiên
      const newMessage = messageInput.replace(/(:\w*)$/, selectedEmoji.unicode + " ");
      setMessageInput(newMessage);
      setEmojiSuggestions([]);
      return;
    }

    // Gửi tin nhắn khi nhấn Enter (không có Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmedMessage = messageInput.trim();
      if (trimmedMessage !== "") {
        handleSendMessage(trimmedMessage);
        setMessageInput("");
      }
    }
  };

  // Khi chọn emoji từ menu, chèn vào messageInput
  const handleEmojiSelect = (emoji) => {
    setMessageInput((prev) => prev + emoji.unicode);
    setShowEmojiMenu(false);
    setEmojiSuggestions([]);
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef?.current) {
      // Điều chỉnh chiều cao của textarea tự động theo nội dung
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  // Các lớp CSS tùy theo dark/light mode
  const containerClass = isDarkMode
    ? "bg-[#383a40] text-gray-100"
    : "bg-[#F8F9FA] text-[#333333] shadow-md border border-gray-200";

  const textareaClass = isDarkMode
    ? "flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
    : "flex-1 bg-[#F8F9FA] border-none px-4 py-2 text-[#333333] placeholder-gray-500 focus:outline-none resize-none overflow-hidden shadow-sm transition-all";

  const EmojiButtonClass = isDarkMode
    ? "p-2 hover:bg-[#404249] rounded-lg"
    : "p-2 bg-[#2866B7FF] text-white rounded-lg shadow-sm hover:bg-[#0D6EFD] transition duration-200";

  return (
    <div className={`absolute bottom-0 left-0 right-0 ${containerClass} border border-gray-400 rounded-lg p-2`}>
      <div className="flex flex-col">
        <ShowFile
          files={files}
          onRemoveFile={handleRemoveFile}
          onFileSelect={handleFileSelect}
        />

        <div className="flex items-center relative mt-2">
          <UploadFile onFileSelect={handleFileSelect} />

          <textarea
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${t("Message @")}${friend?.name || ""}`}
            className={textareaClass}
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
              lineHeight: "20px",
            }}
          />

          <button className={EmojiButtonClass}>
            <SmilePlus
              size={20}
              className="text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiMenu((prev) => !prev);
              }}
            />
          </button>

          {showEmojiMenu && (
            <EmojiMenu onSelect={handleEmojiSelect} onClose={() => setShowEmojiMenu(false)} />
          )}

          {/* Hiển thị danh sách gợi ý emoji: hiện ở phía trên (bottom-full) textarea */}
          {emojiSuggestions.length > 0 && (
            <div
              className="absolute bottom-full left-0 mb-1 bg-white dark:bg-[#2b2d31] border border-gray-300 dark:border-gray-600 rounded shadow-md z-50 max-h-40 overflow-y-auto"
              style={{ 
                width: "180px" ,
                scrollbarWidth: "thin",
                scrollbarColor: "grey transparent",
              }}
            >
              {emojiSuggestions.map((emoji, index) => (
                <button
                  key={index}
                  className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={() => {
                    const newMessage = messageInput.replace(/(:\w*)$/, emoji.unicode + " ");
                    setMessageInput(newMessage);
                    setEmojiSuggestions([]);
                    if (inputRef?.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <img src={emoji.url} alt={emoji.name} className="w-6 h-6 mr-1" />
                  <span className="text-sm">{emoji.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
