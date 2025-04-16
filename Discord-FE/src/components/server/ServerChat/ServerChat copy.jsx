import { useState, useRef, useEffect } from "react";
import { Plus, SmilePlus, Gift, Sticker, ImageIcon, Edit, Trash2 } from "lucide-react";
import SampleAvt from "../../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";
import MessageList from "./Components/MessageList";
import MessageInput from "./Components/MessageInput";

// Import MessageService để gọi api và socket
import MessageService from "../../../services/MessageService";

export default function ServerChat({ channel }) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const messagesWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const beforeRef = useRef(null);
  const [isFetching, setIsFetching] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPrepending, setIsPrepending] = useState(false);
  const limit = 20;
  const { t } = useTranslation();

  // User info
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
  const avatarSrc = storedUser?.avatar || "https://via.placeholder.com/40";

  const loadMessages = (lastTimestamp = null) => {
    setIsLoadingMore(true);
    setIsPrepending(true);
    MessageService.fetchMoreMessages({

      channel_id: channel.id,
      limit: limit,
      lastTimestamp: new Date(lastTimestamp).getTime() || Date.now(),
    });
  };

  const handleScroll = () => {
    const container = messagesWrapperRef.current;
    if (!container || isLoadingMore || !hasMoreMessages) return;
    if (container.scrollTop === 0) {
      const oldest = messages[0];
      if (oldest) {
        beforeRef.current = oldest.timestamp;
        loadMessages(oldest.timestamp);
      }
    }
  };

  useEffect(() => {
    const container = messagesWrapperRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, isLoadingMore]);

  useEffect(() => {
    if (!channel?.id) return;

    MessageService.joinChannel(channel.id);
    loadMessages();

    MessageService.onMoreMessages((moreMessages) => {
      const container = messagesWrapperRef.current;
      const previousScrollHeight = container.scrollHeight;
      const previousScrollTop = container.scrollTop;

      if (moreMessages.length < limit) setHasMoreMessages(false);

      setMessages((prev) =>
        beforeRef.current ? [...moreMessages, ...prev] : [...moreMessages]
      );

      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - (previousScrollHeight - previousScrollTop);
        setIsPrepending(false);
      }, 0);

      setIsLoadingMore(false);
    });

    MessageService.onReceiveMessage((newMessage) => {
      const container = messagesWrapperRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      setMessages((prev) => [...prev, newMessage]);
      if (isNearBottom) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 0);
      }
    });

    MessageService.onMessageUpdated((data) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.message_id === data.message_id ? data : msg))
      );
    });

    MessageService.onMessageDeleted((data) => {
      setMessages((prev) =>
        prev.filter((msg) => msg.message_id !== data.message_id)
      );
    });

    return () => {
      MessageService.offAllListeners();
    };
  }, [channel.id]);

  useEffect(() => {
    if (!isPrepending) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPrepending]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    console.log("Sending message:", messageInput);
    const newMessage = {
      
      channelId: channel.id,    // sửa key ở đây
      sender: username,         // sửa key ở đây
      content: messageInput,
      timestamp: Date.now(),
      attachments: [],
    };
    MessageService.sendMessage(newMessage, (ack) => {
      console.log("Server ack:", ack);
      // Nếu server xác nhận, bạn có thể xử lý gì đó (ví dụ: thêm tin nhắn vào state nếu cần)
    });
    setMessageInput("");
    if (inputRef.current) inputRef.current.style.height = "40px";
  };
  

  const handleDeleteMessage = (id) => {
    MessageService.deleteMessage(channel.id, id);
  };

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = (id) => {
    if (!editedContent.trim()) return;
    MessageService.editMessage({
      channel_id: channel.id,
      message_id: id,
      content: editedContent,
      attachments: [],
    });
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