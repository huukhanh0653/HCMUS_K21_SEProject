import { useState } from "react";
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
      console.log("Bắt đầu upload file:", file.name);
      
      const formData = new FormData();
      formData.append("file", file);

      console.log("Đang gửi request đến server...");
      const response = await fetch("http://localhost:8080/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error("Upload failed: " + errorText);
      }

      const data = await response.text();
      console.log("Response data:", data);
      
      const fileUrl = data.split(": ")[1];
      console.log("File URL:", fileUrl);
      
      setUploadedUrls(prev => [...prev, fileUrl]);
      return fileUrl;
    } catch (error) {
      console.error("Error details:", error);
      return null;
    }
  };

  const handleFileSelect = async (file) => {
    console.log("File được chọn:", file);
    setShowFile(prev => [...prev, file]);
    
    const fileUrl = await uploadToGCS(file);
    if (fileUrl) {
        console.log("Upload thành công, URL:", fileUrl);
    } else {
        console.log("Upload thất bại");
    }
    setShowUpload(false);
  };

  const handleRemoveFile = (fileName) => {
    setShowFile((prev) => prev.filter((file) => file.name !== fileName));
  };

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
            placeholder={`${t("Message @")}${friend?.name || ""}`}
            className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
            rows={1}
            style={{ minHeight: "40px", height: "40px", maxHeight: "120px" }}
          />
          <button className="p-2 hover:bg-[#404249] rounded-lg" onClick={handleSendMessage}>
            <SmilePlus size={20} className="text-gray-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
