import { useState, useRef, useEffect } from "react";
import {
  Plus,
  SmilePlus,
  Gift,
  Sticker,
  ImageIcon,
  Edit,
  Trash2,
} from "lucide-react";
import SampleAvt from "../../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";
import MessageList from "./Components/MessageList";
import MessageInput from "./Components/MessageInput";

// Import hàm connectMessageService từ newMessageService.js
import { connectMessageService } from "../../../services/newMessageService";

export default function ServerChat({ channel }) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const messagesWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const stompClientRef = useRef(null);

  const { t } = useTranslation();

  // Lấy thông tin người dùng từ localStorage (user_info và username)
  const [storedUser, setStoredUser] = useState(null);
  const [storedUsername, setStoredUsername] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem("user_info");
    const usernameData = localStorage.getItem("username");

    if (userData) {
      try {
        setStoredUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user_info:", error);
      }
    }
    if (usernameData) setStoredUsername(usernameData);
  }, []);
  const username = storedUsername || storedUser?.name || "User";
  // Sử dụng ảnh mẫu cục bộ thay vì URL via.placeholder.com (để tránh lỗi DNS)
  const avatarSrc = storedUser?.avatar || SampleAvt;

  // Kết nối với dịch vụ tin nhắn sử dụng newMessageService để subscribe nhận tin nhắn từ backend
  useEffect(() => {
    if (!channel?.id) return;
    const serverId = "default";

    // Gọi hàm kết nối và truyền vào stompClientRef, setMessages, serverId và channel.id
    const disconnect = connectMessageService(
      stompClientRef,
      setMessages,
      serverId,
      "general"
    );

    // Cleanup: ngắt kết nối khi channel thay đổi hoặc component unmount
    return () => {
      disconnect();
    };
  }, [channel?.id, channel?.serverId]);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hàm gửi tin nhắn qua API (POST)
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    const serverId = "default";
    const payload = {
      messageId: "msg-" + Date.now(), // Tạo id dựa trên timestamp
      senderId: storedUser?.id || "unknown", // Nếu không có thông tin user, để "unknown"
      serverId: serverId,
      channelId: "general", // Hoặc lấy từ channel.id nếu cần
      content: messageInput,
      attachments: [], // Nếu có file đính kèm, cập nhật mảng này
    };

    try {
      // Lưu ý: Sử dụng URL tương đối "/messages" để nhờ proxy (nếu bạn đã cấu hình proxy trong vite.config.ts)
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to send message:", errorText);
      } else {
        console.log("Message sent successfully");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessageInput("");
    if (inputRef.current) inputRef.current.style.height = "40px";
  };

  // Các hàm xử lý xoá & chỉnh sửa tin nhắn (nếu cần)
  const handleDeleteMessage = (id) => {
    // Ví dụ: xoá tin nhắn khỏi state (và có thể gọi API xoá tin nhắn nếu cần)
    setMessages((prev) => prev.filter((msg) => msg.message_id !== id));
  };

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = (id) => {
    if (!editedContent.trim()) return;
    // Ví dụ: cập nhật tin nhắn trong state (và có thể gọi API chỉnh sửa tin nhắn)
    setMessages((prev) =>
      prev.map((msg) =>
        msg.message_id === id ? { ...msg, content: editedContent } : msg
      )
    );
    setEditingMessageId(null);
    setEditedContent("");
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <MessageList
        messages={messages}
        username={username}
        editingMessageId={editingMessageId}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        setEditingMessageId={setEditingMessageId}
        handleDeleteMessage={handleDeleteMessage}
        handleSaveEdit={handleSaveEdit}
        messagesWrapperRef={messagesWrapperRef}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        t={t}
        inputRef={inputRef}
        value={messageInput}
        onChange={setMessageInput}
        onSend={handleSendMessage}
        channelName={channel?.name || ""}
      />
    </div>
  );
}
