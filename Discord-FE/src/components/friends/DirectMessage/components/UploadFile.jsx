import { useState, useRef } from "react";
import { FolderPlus, ClipboardList, AppWindow } from "lucide-react";

export default function UploadFile({ onFileSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null); // Ref cho input file

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
      setIsOpen(false); // Ẩn dropdown ngay sau khi chọn  file
      event.target.value = ""; // Reset input để có thể chọn lại cùng một file
    }
  };

  return (
    <div className="relative">
      {/* Nút mở dropdown */}
      <button className="p-2 hover:bg-[#404249] rounded-lg" onClick={() => setIsOpen(!isOpen)}>
        <FolderPlus size={20} className="text-gray-200" />
      </button>

      {/* Dropdown chỉ hiện khi isOpen = true */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-[#383a40] p-2 rounded-lg shadow-lg w-48 z-50">
          {/* Nút Tải Lên */}
          <label className="flex items-center p-2 hover:bg-[#404249] rounded cursor-pointer">
            <span className="text-gray-200">Tải Lên Tệp</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>

          {/* Các nút khác */}
          <button className="flex items-center p-2 hover:bg-[#404249] rounded w-full">
            <span className="text-gray-200">Tạo Chủ Đề</span>
          </button>
          <button className="flex items-center p-2 hover:bg-[#404249] rounded w-full">
            <span className="text-gray-200">Dùng Ứng Dụng</span>
          </button>
        </div>
      )}
    </div>
  );
}
