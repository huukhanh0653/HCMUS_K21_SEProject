import React, { useState, useRef, useEffect, useCallback } from "react";
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
  useSearchMessages,
  useFetchMessagesBefore,
  useFetchMessagesAfter,
  useEditMessage,
  useDeleteMessage,
} from "../../../services/newMessageService";

export default function ServerChat(props) {
  const { server, channel } = props;
  const { t } = useTranslation();

  // user info
  const user = JSON.parse(localStorage.getItem("user"));

  // chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(false);

  const messagesWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const ListRef = useRef(null);

  const serverId = server.id || '';
  const channelId = channel.id;

  // GraphQL mutations
  const [editMessageMutation] = useEditMessage();
  const [deleteMessageMutation] = useDeleteMessage();

  // Fetch initial batch of messages (latest 'amount')
  const {
    data: beforeData,
    loading: beforeLoading,
    error: beforeError,
    refetch: refetchBefore,
    fetchMore: fetchMoreBefore,
  } = useFetchMessagesBefore({ serverId, channelId, amount: 20, timestamp: lastTimestamp });
    
  // chỉ để debug: log kết quả của hook mỗi khi thay đổi
  useEffect(() => {
    console.group("[useFetchMessagesBefore]");
    console.log("   → loading:", beforeLoading);
    console.log("   → error:", beforeError);
    console.log("   → data:", beforeData);
    console.groupEnd();
  }, [beforeLoading, beforeError, beforeData]);

  // Fetch new messages after last known timestamp
  const { 
    fetchMore: fetchMoreAfter 
  } = useFetchMessagesAfter({ serverId, channelId, amount: 20, timestamp: lastTimestamp });

  // Kết nối với dịch vụ tin nhắn sử dụng newMessageService để subscribe nhận tin nhắn từ backend
  useEffect(() => {
    if (!channel?.id || !server?.id) return;
    

    // Gọi hàm kết nối và truyền vào stompClientRef, setMessages, serverId và channel.id
    const disconnect = connectMessageService(
      stompClientRef,
      setMessages,
      server?.id,
      channel?.id
    );

    // Khi vừa kết nối xong, lấy luôn batch tin mới nhất
    refetchBefore();
    console.log("Messages:", messages);

    return () => {
      disconnect();
    };
  }, [serverId, channelId, refetchBefore]);

  // Khởi tạo tin nhắn khi dữ liệu trước đó đến.
  useEffect(() => {
    if (beforeData?.fetchMessagesBefore) {
      const { messages: fetched, hasMore: more, lastMessageTimestamp } = beforeData.fetchMessagesBefore;
      console.log("Fetched:", fetched);
      setMessages(fetched);
      setHasMore(more);
      setLastTimestamp(lastMessageTimestamp);
    }
  }, [beforeData]);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load tin nhắn cũ (infinite scroll)
  const loadOlder = useCallback(async () => {
    if (!hasMore) return;
    const { data } = await fetchMoreBefore({ variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp } });
    const { messages: older, hasMore: more, lastMessageTimestamp } = data.fetchMessagesBefore;
    setMessages((prev) => [...older, ...prev]);
    setHasMore(more);
    setLastTimestamp(lastMessageTimestamp);
  }, [hasMore, lastTimestamp, fetchMoreBefore, serverId, channelId]);

  // Load tin nhắn mới
  const loadNewer = useCallback(async () => {
    const { data } = await fetchMoreAfter({ variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp } });
    const { messages: newer, lastMessageTimestamp } = data.fetchMessagesAfter;
    setMessages((prev) => [...prev, ...newer]);
    setLastTimestamp(lastMessageTimestamp);
  }, [lastTimestamp, fetchMoreAfter, serverId, channelId]);

  // Load tin nhắn cũ (infinite scroll)
  const loadOlder = useCallback(async () => {
    if (!hasMore) return;
    const { data } = await fetchMoreBefore({ variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp } });
    const { messages: older, hasMore: more, lastMessageTimestamp } = data.fetchMessagesBefore;
    setMessages((prev) => [...older, ...prev]);
    setHasMore(more);
    setLastTimestamp(lastMessageTimestamp);
  }, [hasMore, lastTimestamp, fetchMoreBefore, serverId, channelId]);

  // Load tin nhắn mới
  const loadNewer = useCallback(async () => {
    const { data } = await fetchMoreAfter({ variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp } });
    const { messages: newer, lastMessageTimestamp } = data.fetchMessagesAfter;
    setMessages((prev) => [...prev, ...newer]);
    setLastTimestamp(lastMessageTimestamp);
  }, [lastTimestamp, fetchMoreAfter, serverId, channelId]);

  // Hàm gửi tin nhắn qua API (POST)
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    const payload = {
      messageId: "msg-" + Date.now(), // Tạo id dựa trên timestamp
      senderId: storedUser?.id || "unknown", // Nếu không có thông tin user, để "unknown"
      serverId: server.id,
      channelId: channel.id, // Hoặc lấy từ channel.id nếu cần
      content: messageInput,
      attachments: [], // Nếu có file đính kèm, cập nhật mảng này
    };

    try {
      // Lưu ý: Sử dụng URL tương đối "/messages" để nhờ proxy (nếu bạn đã cấu hình proxy trong vite.config.ts)
      const response = await fetch("/send", {
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
        username={user.username}
        avatarSrc={user.avatar}
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
