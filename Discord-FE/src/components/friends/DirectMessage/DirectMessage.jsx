import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

export default function DirectMessage({ friend, messages: initialMessages = [] }) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSendMessage = () => {
    if (!messageInput.trim() || !friend) return;
    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: messageInput,
      timestamp: Date.now(),
    };
    setMessages([...messages, newMessage]);
    setMessageInput("");
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
        editingMessageId={editingMessageId}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        setEditingMessageId={setEditingMessageId}
        handleDeleteMessage={handleDeleteMessage}
        handleSaveEdit={handleSaveEdit}
        messagesEndRef={messagesEndRef}
        friend={friend}
      />
      <MessageInput
        t={t}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        inputRef={inputRef}
        friend={friend}
      />
    </div>
  );
}
