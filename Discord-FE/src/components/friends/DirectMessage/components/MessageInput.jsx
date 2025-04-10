import { useState, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import UploadFile from "./UploadFile";
import ShowFile from "./ShowFile";

export default function MessageInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
  t,
  friend,
  inputRef,
}) {
  const [showUpload, setShowUpload] = useState(false);
  const [showFile, setShowFile] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

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

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
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
            className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
              lineHeight: "20px",
            }}
          />

          <button
            className="p-2 hover:bg-[#404249] rounded-lg"
            onClick={handleSendClick}
          >
            <SmilePlus size={20} className="text-gray-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
