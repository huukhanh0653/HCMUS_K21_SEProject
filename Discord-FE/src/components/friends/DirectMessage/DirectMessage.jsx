import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import {
  connectMessageService,
  disconnectMessageService,
  useFetchMessagesBefore,
  useFetchMessagesAfter,
} from "../../../services/newMessageService";
import StorageService from "../../../services/StorageService";


export default function DirectMessage({ friend, messages: initialMessages = [] }) {
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const serverId = "direct-message";

  // Generate a symmetric channelId from the two user IDs
  const channelId = useMemo(() => {
    const ids = [user.id, friend._id].sort();
    return ids.join("-");
  }, [user.id, friend._id]);
  
  // Chat state
  const [messages, setMessages] = useState(initialMessages);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(false);
  const [skipAutoScroll, setSkipAutoScroll] = useState(false);   // flag để tạm không auto-scroll khi load tin cũ

  //Biến lưu file chuẩn bị trước khi gửi tin nhắn
  const [files, setFiles] = useState([]);
  
  // Refs
  const stompClientRef = useRef(null);
  const messagesWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialFetchedRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Hooks to fetch messages
  const { 
    data: beforeData,
    refetch: refetchBefore,
    fetchMore: fetchMoreBefore 
  } = useFetchMessagesBefore({
    serverId,
    channelId,
    amount: 20,
    timestamp: lastTimestamp,
  });

  // Initial load & WebSocket connect
  useEffect(() => {
    // Reset state when friend changes
    setMessages([]);
    setHasMore(false);
    initialFetchedRef.current = false;
    setLastTimestamp(new Date().toISOString());
    isLoadingRef.current = false;
  
    // Connect to the message service
    const disconnect = connectMessageService(
      stompClientRef,
      setMessages,
      serverId,
      channelId
    );
  
    // Fetch initial batch
    loadMessages();
  
    return () => {
      // Clean up subscription on unmount / friend change
      disconnect();
    };
  }, [serverId, channelId]);

  const loadMessages = useCallback(async () => {
    // Nếu đã đang chạy, bỏ qua
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const { data } = await fetchMoreBefore({
        variables: { 
          serverId, 
          channelId, 
          amount: 20, 
          timestamp: new Date(Date.now()).toISOString() },
      });

      const {
        messages: fetched,
        hasMore: more,
        lastMessageTimestamp,
      } = data.fetchMessagesBefore;

      setMessages(fetched.slice().reverse());
      setHasMore(more);
      setLastTimestamp(lastMessageTimestamp);
      initialFetchedRef.current = true;
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      isLoadingRef.current = false;
    }
  }, [fetchMoreBefore, serverId, channelId]);

  // Load tin nhắn cũ (infinite scroll)
  const loadOlder = useCallback(async () => {
    if (!hasMore) return;
    setSkipAutoScroll(true);
    const { data } = await fetchMoreBefore({
      variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp },
    });
    const { messages: older, hasMore: more, lastMessageTimestamp } =
      data.fetchMessagesBefore;
    setMessages((prev) => [...older.slice().reverse(), ...prev]);
    setHasMore(more);
    setLastTimestamp(lastMessageTimestamp);
  }, [hasMore, lastTimestamp, fetchMoreBefore, serverId, channelId]);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (skipAutoScroll) {
      setSkipAutoScroll(false);
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Send a new message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !friend) return;

    // Upload all files, gather URLs
    let uploadedUrls = [];
    if (files.length > 0) {
      try {
        const uploads = files.map(file => StorageService.uploadFile(file));
        const results = await Promise.all(uploads);
        uploadedUrls = results.map(r => r.url);
      } catch (err) {
        console.error("File upload error:", err);
        toast.error("Upload file thất bại");
      }
    }

    const payload = {
      messageId: "msg-" + Date.now(), // Tạo id dựa trên timestamp
      senderId: user.id || "unknown", // Nếu không có thông tin user, để "unknown"
      serverId: serverId,
      channelId: channelId, // Hoặc lấy từ channel.id nếu cần
      content: messageInput,
      attachments: uploadedUrls, // Nếu có file đính kèm, cập nhật mảng này
    };

    try {
      await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setMessageInput("");
    setFiles([]);
    if (inputRef.current) inputRef.current.style.height = "36px";
  };

  const handleDeleteMessage = (id) => setMessages((prev) => prev.filter((msg) => msg.id !== id));

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = (id) => {
    if (!editedContent.trim()) return;
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content: editedContent } : msg))
    );
    setEditingMessageId(null);
    setEditedContent("");
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <MessageList
        messages={messages}
        user={user}
        friend={friend}
        editingMessageId={editingMessageId}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        setEditingMessageId={setEditingMessageId}
        handleDeleteMessage={handleDeleteMessage}
        handleSaveEdit={handleSaveEdit}
        messagesEndRef={messagesEndRef}
        loadOlder={loadOlder}
        hasMore={hasMore}
      />
      <MessageInput
        t={t}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        inputRef={inputRef}
        friend={friend}
        files={files}
        setFiles={setFiles}
      />
    </div>
  );
}
