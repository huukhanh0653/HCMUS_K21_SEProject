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
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

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

  // Refs
  const stompClientRef = useRef(null);
  const messagesWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const ListRef = useRef(null);
  const initialFetchedRef = useRef(false); 
  const isLoadingRef = useRef(false);

  const serverId = server.id || '';
  const channelId = channel.id;

  // GraphQL mutations
  const [editMessageMutation] = useEditMessage();
  const [deleteMessageMutation] = useDeleteMessage();

  // Fetch initial batch of messages (latest 'amount')
  // Hooks để fetch messages
  const {
    data: beforeData,
    loading: beforeLoading,
    error: beforeError,
    refetch: refetchBefore,
    fetchMore: fetchMoreBefore,
  } = useFetchMessagesBefore({
    serverId,
    channelId,
    amount: 20,
    timestamp: lastTimestamp,
  });

  // Fetch new messages after last known timestamp
  const { 
    fetchMore: fetchMoreAfter,
    data: afterData,
  } = useFetchMessagesAfter({
    serverId,
    channelId,
    amount: 20,
    timestamp: lastTimestamp,
  });

  // Kết nối với dịch vụ tin nhắn sử dụng newMessageService để subscribe nhận tin nhắn từ backend
  useEffect(() => {
    if (!channel?.id || !server?.id) return;
    // reset mọi thứ khi đổi kênh
    setMessages([]);
    setHasMore(false);
    initialFetchedRef.current = false;
    setLastTimestamp(new Date(Date.now()).toISOString());
    isLoadingRef.current = false;

    
    // set channelId hiện tại
    localStorage.setItem("channelId", channelId);

    // gọi đầu tiên
    loadMessages();

    // Gọi hàm kết nối và truyền vào stompClientRef, setMessages, serverId và channel.id
    const connect = connectMessageService(
      stompClientRef,
      setMessages,
      server?.id,
      channel?.id
    );

    return () => {
      connect();
    };
  }, [serverId, channelId]);

  // Khởi tạo tin nhắn khi dữ liệu trước đó đến.
  /*useEffect(() => {
    // 1) Khi load lần đầu từ trước (beforeData)
    if (beforeData?.fetchMessagesBefore && !initialFetchedRef.current) {
      const { messages: fetched, hasMore: more, lastMessageTimestamp } =
        beforeData.fetchMessagesBefore;

      setMessages(fetched);
      setHasMore(more);
      console.log("Fetched before:", fetched);
      initialFetchedRef.current = true;
      setLastTimestamp(lastMessageTimestamp);
    }

    // 2) Khi có kết quả fetchMessagesAfter
    if (afterData?.fetchMessagesAfter) {
      const { messages: newer } = afterData.fetchMessagesAfter;
      console.log("Fetched after:", newer);
      // nếu muốn, có thể merge mới vào state:
      // setMessages(prev => [...prev, ...newer]);
    }
  }, [beforeData, afterData]);*/

  const loadMessages = useCallback(async () => {
    // Nếu đã đang chạy, bỏ qua
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      if (!fetchMoreBefore || !channel?.id) {
        console.error("fetchMoreBefore or channel.id is undefined");
        return;
      }

      const { data } = await fetchMoreBefore({
        variables: { serverId, channelId, amount: 10, timestamp: new Date(Date.now()).toISOString() },
      });

      // Nếu giữa chừng user đã gọi loadMessages khác (bộ đếm đã thay đổi), bỏ qua kết quả
      if (channel.id !== localStorage.getItem('channelId')) {
        console.log(localStorage.getItem('channelId'));
        console.log(channel.id);
        return;
      }

      const {
        messages: fetched,
        hasMore: more,
        lastMessageTimestamp,
      } = data.fetchMessagesBefore;


      setMessages(fetched.slice().reverse());
      setHasMore(more);
      setLastTimestamp(lastMessageTimestamp);
      initialFetchedRef.current = true;
      console.log("Loaded messages:", fetched);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      // Reset loading flag
      isLoadingRef.current = false;
    }
  }, [serverId, channelId, lastTimestamp, fetchMoreBefore]);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    console.log("Có tin mới")
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load tin nhắn cũ (infinite scroll)
  const loadOlder = useCallback(async () => {
    if (!hasMore) return;
    const { data } = await fetchMoreBefore({ variables: { serverId, channelId, amount: 20, timestamp: lastTimestamp } });
    console.log("Data:",data);
    const { messages: older, hasMore: more, lastMessageTimestamp } = data.fetchMessagesBefore;
    
    const olderChrono = older.slice().reverse();
    setMessages(prev => [...olderChrono, ...prev]);
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
      senderId: user.id || "unknown", // Nếu không có thông tin user, để "unknown"
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
  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessageMutation({
        variables: { 
          serverId, 
          channelId, 
          messageId: id
        },
      });
      // filter state
      setMessages(prev =>
        prev.filter(
          (msg) =>
            (msg.messageId || msg.message_id) !== id
        )
      );
      toast.success("Đã xóa tin nhắn");
    } catch (err) {
      console.error(err);
      toast.error("Xóa tin nhắn thất bại");
    }
  };

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = async (id) => {
    if (!editedContent.trim()) return;
    try {
      const { data } = await editMessageMutation({
        variables: {
          serverId,
          channelId,
          messageId: id,
          content: editedContent,
        },
      });
      const updated = data.editMessage;
      setMessages(prev =>
        prev.map(msg => {
          const msgId = msg.messageId || msg.message_id;
          return msgId === id ? { ...msg, content: editedContent } : msg;
        })
      );
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
