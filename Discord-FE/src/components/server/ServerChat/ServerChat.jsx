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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(false);

  // refs
  const stompClientRef = useRef(null);
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

    // Khi vừa kết nối xong, lấy luôn batch tin mới nhất
    refetchBefore();
    console.log("Messages:", messages);

    return () => {
      disconnect();
      disconnectMessageService(stompClientRef);
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

  // Auto-scroll khi có tin mới
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
        username={user.username}
        avatarSrc={user.avatar}
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
