import { useState, useRef } from "react";
import { FolderPlus, ClipboardList, AppWindow } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../layout/ThemeProvider";

export default function UploadFile({ onFileSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null); // Ref cho input file
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
      setIsOpen(false); // Ẩn dropdown ngay sau khi chọn file
      event.target.value = ""; // Reset input để có thể chọn lại cùng một file
    }
  };

  // Lớp CSS dựa trên theme
  const buttonStyle = isDarkMode
    ? "p-2 hover:bg-[#404249] rounded-lg"
    : "p-2 hover:bg-gray-100 rounded-lg";
  const iconStyle = isDarkMode ? "text-gray-200" : "text-gray-700";

  const dropdownStyle = isDarkMode
    ? "absolute bottom-full left-0 mb-2 bg-[#383a40] p-2 rounded-lg shadow-lg w-48 z-50"
    : "absolute bottom-full left-0 mb-2 bg-white p-2 rounded-lg shadow-lg w-48 z-50 border border-gray-200";

  const optionStyle = isDarkMode
    ? "flex items-center p-2 hover:bg-[#404249] rounded cursor-pointer"
    : "flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer";
  const optionTextStyle = isDarkMode ? "text-gray-200" : "text-gray-700";

  return (
    <div className="relative">
      {/* Nút mở dropdown */}
      <button className={buttonStyle} onClick={() => setIsOpen(!isOpen)}>
        <FolderPlus size={20} className={iconStyle} />
      </button>

      {/* Dropdown chỉ hiện khi isOpen = true */}
      {isOpen && (
        <div className={dropdownStyle}>
          {/* Nút Tải Lên */}
          <label className={optionStyle}>
            <span className={optionTextStyle}>{t("Upload File")}</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>

          {/* Các nút khác */}
          <button className={optionStyle}>
            <span className={optionTextStyle}>{t("Create Theme")}</span>
          </button>
          <button className={optionStyle}>
            <span className={optionTextStyle}>{t("Use App")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
