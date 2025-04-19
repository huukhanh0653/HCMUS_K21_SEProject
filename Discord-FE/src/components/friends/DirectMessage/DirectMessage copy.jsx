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
  useEditMessage,
  useDeleteMessage,
} from "../../../services/newMessageService";

export default function DirectMessage({ friend }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const serverId = "direct-message";

  // Generate a symmetric channelId from the two user IDs
  const channelId = useMemo(() => {
    const ids = [user.id, friend._id].sort();
    return ids.join("-");
  }, [user.id, friend._id]);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
  const [hasMore, setHasMore] = useState(false);

  // Refs
  const stompClientRef = useRef(null);
  const messagesWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialFetchedRef = useRef(false);
  const isLoadingRef = useRef(false);

  // GraphQL mutations
  const [editMessageMutation] = useEditMessage();
  const [deleteMessageMutation] = useDeleteMessage();

  // Hooks to fetch messages
  const { fetchMore: fetchMoreBefore } = useFetchMessagesBefore({
    serverId,
    channelId,
    amount: 20,
    timestamp: lastTimestamp,
  });
  const { fetchMore: fetchMoreAfter } = useFetchMessagesAfter({
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

  // Load latest messages before now
  const loadMessages = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    try {
      const { data } = await fetchMoreBefore({
        variables: {
          serverId,
          channelId,
          amount: 20,
          timestamp: new Date().toISOString(),
        },
      });
      const { messages: fetched, hasMore: more, lastMessageTimestamp } =
        data.fetchMessagesBefore;
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

  // Infinite scroll: load older messages
  const loadOlder = useCallback(async () => {
    if (!hasMore) return;
    const { data } = await fetchMoreBefore({
      variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp },
    });
    const { messages: older, hasMore: more, lastMessageTimestamp } =
      data.fetchMessagesBefore;
    setMessages((prev) => [...older.slice().reverse(), ...prev]);
    setHasMore(more);
    setLastTimestamp(lastMessageTimestamp);
  }, [hasMore, lastTimestamp, fetchMoreBefore, serverId, channelId]);

  // Periodically or on demand load newer messages
  const loadNewer = useCallback(async () => {
    const { data } = await fetchMoreAfter({
      variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp },
    });
    const { messages: newer, lastMessageTimestamp } =
      data.fetchMessagesAfter;
    setMessages((prev) => [...prev, ...newer]);
    setLastTimestamp(lastMessageTimestamp);
  }, [fetchMoreAfter, serverId, channelId, lastTimestamp]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    const payload = {
      messageId: "dm-" + Date.now(),
      senderId: user.id,
      serverId,
      channelId,
      content: messageInput,
      attachments: [],
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
    if (inputRef.current) inputRef.current.style.height = "40px";
  };

  // Delete a message
  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessageMutation({
        variables: { serverId, channelId, messageId: id },
      });
      setMessages((prev) =>
        prev.filter(
          (msg) => (msg.messageId || msg.message_id) !== id
        )
      );
      toast.success("Đã xóa tin nhắn");
    } catch (err) {
      console.error(err);
      toast.error("Xóa tin nhắn thất bại");
    }
  };

  // Save an edited message
  const handleSaveEdit = async (id) => {
    if (!editedContent.trim()) return;
    try {
      await editMessageMutation({
        variables: { serverId, channelId, messageId: id, content: editedContent },
      });
      setEditingMessageId(null);
      setEditedContent("");
      toast.success("Chỉnh sửa tin nhắn thành công");
    } catch (err) {
      console.error(err);
      toast.error("Chỉnh sửa tin nhắn thất bại");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <MessageList
        messages={messages}
        username={user.username}
        avatarSrc={friend.avatar}
        editingMessageId={editingMessageId}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        setEditingMessageId={setEditingMessageId}
        handleDeleteMessage={handleDeleteMessage}
        handleSaveEdit={handleSaveEdit}
        messagesWrapperRef={messagesWrapperRef}
        messagesEndRef={messagesEndRef}
        loadOlder={loadOlder}
        loadNewer={loadNewer}
      />
      <MessageInput
        t={t}
        inputRef={inputRef}
        value={messageInput}
        onChange={setMessageInput}
        onSend={handleSendMessage}
        friendName={friend.username}
      />
    </div>
  );
}
