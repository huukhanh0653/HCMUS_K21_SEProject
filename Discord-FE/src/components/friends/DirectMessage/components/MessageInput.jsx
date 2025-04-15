import { useState, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import UploadFile from "./UploadFile";
import ShowFile from "./ShowFile";
import { useTheme } from "../../../layout/ThemeProvider";
import EmojiMenu from "../../../EmojiMenu";

export default function MessageInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
  t,
  friend,
  inputRef,
}) {
  // Các state phục vụ upload file & emoji
  const [showUpload, setShowUpload] = useState(false);
  const [showFile, setShowFile] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  // State để điều khiển hiển thị menu emoji
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const { isDarkMode } = useTheme();

  // Hàm upload file lên server
  const uploadToGCS = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8080/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Upload failed: " + errorText);
      }

      const data = await response.text();
      const fileUrl = data.split(": ")[1];
      setUploadedUrls((prev) => [...prev, fileUrl]);
      return fileUrl;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleFileSelect = async (file) => {
    setShowFile((prev) => [...prev, file]);
    const fileUrl = await uploadToGCS(file);
    if (!fileUrl) {
      console.warn("File upload failed");
    }
    setShowUpload(false);
  };

  const handleRemoveFile = (fileName) => {
    setShowFile((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmedMessage = messageInput.trim();
      if (trimmedMessage !== "") {
        handleSendMessage(trimmedMessage);
        setMessageInput("");
      }
    }
  };

  const handleSendClick = () => {
    const trimmedMessage = messageInput.trim();
    if (trimmedMessage !== "") {
      handleSendMessage(trimmedMessage);
      setMessageInput("");
    }
  };

  // Hàm chèn emoji vào nội dung soạn
  const handleEmojiSelect = (emoji) => {
    setMessageInput((prev) => prev + emoji.unicode);
    setShowEmojiMenu(false);
    // Tập trung lại vào textarea sau khi chọn emoji (nếu cần)
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef?.current) {
      // Tự động điều chỉnh chiều cao của textarea theo nội dung
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  // Cấu hình giao diện cho Dark/Light mode
  // Dark Mode: dùng nền tối với chữ sáng như code Dark mẫu
  // Light Mode: nền trắng/sáng, chữ tối, thêm hiệu ứng đổ bóng và đường viền tinh tế
  const containerClass = isDarkMode
    ? "bg-[#383a40] text-gray-100"
    : "bg-[#F8F9FA] text-[#333333] shadow-md border border-gray-200";
    
  const textareaClass = isDarkMode
    ? "flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
    : "flex-1 bg-[#F8F9FA] border-none px-4 py-2 text-[#333333] placeholder-gray-500 focus:outline-none resize-none overflow-hidden shadow-sm transition-all";

  const EmojiButtonClass = isDarkMode
    ? "p-2 hover:bg-[#404249] rounded-lg"
    : "p-2 bg-[#2866B7FF] text-white rounded-lg shadow-sm hover:bg-[#0D6EFD] transition duration-200";;  

  return (
    <div className={`absolute bottom-0 left-0 right-0 ${containerClass} border border-gray-400 rounded-lg p-2`}>
      <div className="flex flex-col">
        <ShowFile
          files={showFile}
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

          <button className={EmojiButtonClass} onClick={handleSendClick}>
            {/* Nút này để mở menu emoji */}
            <SmilePlus
              size={20}
              className="text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiMenu((prev) => !prev);
              }}
            />
          </button>

          {/* Hiển thị menu emoji khi chọn */}
          {showEmojiMenu && (
            <EmojiMenu onSelect={handleEmojiSelect} onClose={() => setShowEmojiMenu(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
