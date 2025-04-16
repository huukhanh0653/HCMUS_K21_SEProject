import React, { useState, useEffect } from "react";
import VoiceChat from "./VoiceChat/VoiceChat"; // Điều chỉnh đường dẫn theo cấu trúc thư mục của bạn

/**
 * Component hiển thị Popup cho Voice Chat.
 * Popup có header hiển thị tên server → tên channel và nút thoát,
 * và có thể kéo được (draggable) bằng thao tác trên header.
 */
const VoiceChatPopup = ({ serverName, channel, onClose }) => {
  // Lấy thông tin user hiện tại từ localStorage (hoặc có thể sử dụng context)
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // State lưu vị trí của popup (với giá trị mặc định khi mount)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Thiết lập vị trí khởi tạo dựa trên kích thước cửa sổ
  useEffect(() => {
    const initialX = window.innerWidth - 300 - 16; // Popup width: 300px + margin
    const initialY = window.innerHeight - 400;       // Giả sử chiều cao khoảng 400px
    setPosition({ x: initialX, y: initialY });
  }, []);

  // Xử lý khi kéo: add sự kiện toàn cục khi đang kéo
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  // Khi người dùng nhấn chuột xuống trên header để bắt đầu kéo
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  return (
    <div
      className="fixed bg-white text-[#333333] shadow-lg border border-gray-200 rounded overflow-hidden z-50"
      style={{
        width: "300px",
        maxHeight: "60vh",
        left: position.x,
        top: position.y
      }}
    >
      {/* Header: hiển thị tên server → tên channel, có class cursor-move để biểu thị có thể kéo */}
      <div
        className="p-2 border-b border-gray-300 flex justify-between items-center cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm font-semibold truncate">
          {serverName} → {channel?.name}
        </h3>
        {/* Nút thoát voice chat */}
        <button onClick={onClose} title="Hang up" className="text-red-500 hover:text-red-600">
          ✕
        </button>
      </div>

      {/* Nội dung của voice chat */}
      <VoiceChat user={currentUser} channel={channel} onLeave={onClose} />
    </div>
  );
};

export default VoiceChatPopup;
