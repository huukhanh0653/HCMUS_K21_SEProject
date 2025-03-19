import { useState, useRef, useEffect } from "react";
import { Plus, SmilePlus, Gift, Sticker, ImageIcon, Edit, Trash2 } from "lucide-react";
import SampleAvt from "../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";

export default function DirectMessage({ friend, messages: initialMessages = [] }) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  // Scroll to bottom of messages when messages change
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !friend) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: messageInput,
      timestamp: `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = (id) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, content: editedContent } : message
      )
    );
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    // Auto-expand textarea but limit to 3 lines (max-height: 300px)
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage();
      e.preventDefault();
      // Reset textarea height after sending
      if (inputRef.current) {
        inputRef.current.style.height = "36px";
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages area with scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        style={{
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "grey transparent", // Firefox
        }}
      >
        {messages.length > 0 ? (
          <div>
            {messages.map((message) => (
              <div key={message.id} className="mb-4 hover:bg-[#2e3035] rounded p-2 -mx-2">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden flex-shrink-0">
                    <img
                      src={message.sender === "You" ? SampleAvt : friend.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={message.sender}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{message.sender}</span>
                        <span className="text-xs text-gray-400">{t('Today at')} {message.timestamp}</span>
                      </div>

                      {/* Edit & Delete Buttons (Only for 'You') */}
                      {message.sender === "You" && (
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-gray-400 hover:text-gray-200"
                            onClick={() => handleEditMessage(message.id, message.content)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit Mode */}
                    {editingMessageId === message.id ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full bg-[#404249] text-gray-100 p-2 mt-1 rounded-md focus:outline-none resize-none break-words whitespace-pre-wrap break-all"
                        rows={2}
                        autoFocus
                        onBlur={() => handleSaveEdit(message.id)}
                      />
                    ) : (
                      <p className="text-gray-100 break-words whitespace-pre-wrap break-all text-left overflow-hidden">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#36393f] overflow-hidden mb-4">
              <img
                src={friend.avatar || "/placeholder.svg?height=64&width=64"}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{friend.name}</h3>
            <p className="text-gray-400 max-w-md">
              {t('This is the beginning of your direct message history with')}{" "}
              <span className="font-semibold">{friend.name}</span>.
            </p>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="bg-[#383a40] p-2 flex-shrink-0">
        <div className="flex items-center p-2 rounded-lg bg-[#404249]">
          <button className="p-2 hover:bg-[#404249] rounded-lg">
            <Plus size={20} className="text-gray-200" />
          </button>
          <textarea
            ref={inputRef}
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`${t('Message @')}${friend.name}`}
            className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
            rows={1}
            style={{ minHeight: "36px", maxHeight: "300px", overflowY: "auto" }}
          />

          <button className="p-2 hover:bg-[#404249] rounded-lg">
            <SmilePlus size={20} className="text-gray-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
