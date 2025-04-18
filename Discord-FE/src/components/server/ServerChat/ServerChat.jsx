import React, { useState, useRef, useEffect } from "react";
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

// newMessageService exports
import {
  connectMessageService,
  disconnectMessageService,
  useEditMessage,
  useDeleteMessage,
} from "../../../services/newMessageService";

export default function ServerChat(props) {
  const { server, channel } = props;
  const { t } = useTranslation();

  // user info
  const [storedUser, setStoredUser] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.username || "Unknown User";
  const avatarSrc = storedUser?.avatar || SampleAvt;

  // chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // refs
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const serverId = server.id || '';
  const channelId = channel.id;

  // GraphQL mutations
  const [editMessageMutation] = useEditMessage();
  const [deleteMessageMutation] = useDeleteMessage();

  // Kết nối WebSocket STOMP
  useEffect(() => {
    console.log("Connecting to STOMP client...", server);
    if (!serverId || !channelId) return;
    const disconnect = connectMessageService(
      stompClientRef,
      setMessages,
      serverId,
      channelId
    );
    return () => {
      disconnect();
      disconnectMessageService(stompClientRef);
    };
  }, [serverId, channelId]);

  // Auto-scroll khi có tin mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn qua STOMP
  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content) return;

    const payload = {
      senderId: user.id || "unknown",
      serverId,
      channelId,
      content,
      attachments: [], // nếu có đính kèm
      mentions: [],    // nếu có mention
    };

    try {
      const res = await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to send message:", err);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessageInput("");
    if (inputRef.current) inputRef.current.style.height = "40px";
  };

  // Xoá tin nhắn
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessageMutation({
        variables: { serverId, channelId, messageId },
      });
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== messageId)
      );
    } catch (err) {
      console.error("DeleteMessage Error:", err);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async (messageId) => {
    const content = editedContent.trim();
    if (!content) return;

    try {
      const { data } = await editMessageMutation({
        variables: { serverId, channelId, messageId, content },
      });
      // data.editMessage chính là object message mới
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? data.editMessage : msg
        )
      );
      setEditingMessageId(null);
      setEditedContent("");
    } catch (err) {
      console.error("EditMessage Error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <MessageList
        messages={messages}
        username={username}
        avatarSrc={avatarSrc}
        editingMessageId={editingMessageId}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        setEditingMessageId={setEditingMessageId}
        onDelete={handleDeleteMessage}
        onEdit={handleEditMessage}
        onSaveEdit={handleSaveEdit}
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
