import { useState, useRef, useEffect } from "react";
import { Plus, SmilePlus, Edit, Trash2 } from "lucide-react";
import SampleAvt from "../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";

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

    if (inputRef.current) {
      inputRef.current.style.height = "36px";
    }
  };

  const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = (id) => {
    if (!editedContent.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content: editedContent } : msg
      )
    );
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <div
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        style={{ scrollbarWidth: "thin", scrollbarColor: "grey transparent" }}
      >
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const currentDate = new Date(message.timestamp);
          const previousDate = previous ? new Date(previous.timestamp) : null;
          console.log(currentDate);
          console.log(previousDate);

          const currentDay = currentDate.toDateString();
          const previousDay = previousDate ? previousDate.toDateString() : null;
          const showDateDivider = currentDay !== previousDay;

          const currentTime = currentDate.getTime();
          const previousTime = previousDate ? previousDate.getTime() : null;

          const isGrouped =
            previous &&
            previous.sender === message.sender &&
            currentDay === previousDay &&
            previousTime &&
            currentTime - previousTime <= 60000;

          const formattedDate = currentDate.toLocaleDateString(i18n.language || "vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          const formattedTime = currentDate.toLocaleTimeString(i18n.language || "vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <div key={message.id} className={`mb-2 ${!isGrouped ? "pt-4" : ""}`}>
              {showDateDivider && (
                <div className="flex justify-center items-center my-6">
                  <div className="border-t border-gray-600 flex-1" />
                  <span className="px-4 text-sm text-gray-400">{formattedDate}</span>
                  <div className="border-t border-gray-600 flex-1" />
                </div>
              )}

              <div className="relative group hover:bg-[#2e3035] rounded px-2 py-1 transition-colors duration-150">
                {!isGrouped && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden flex-shrink-0">
                      <img
                        src={message.sender === "You" ? SampleAvt : friend.avatar || "/placeholder.svg"}
                        alt={message.sender}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.sender}</span>
                          <span className="text-xs text-gray-400">{formattedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${isGrouped ? "pl-14" : "pl-14 mt-1"} relative`}>
                  {editingMessageId === message.id ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full bg-[#404249] text-gray-100 p-2 mt-1 rounded-md focus:outline-none resize-none break-words whitespace-pre-wrap pr-14"
                      rows={2}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit(message.id);
                        }
                      }}
                    />
                  ) : (
                    <p className="text-gray-100 break-words whitespace-pre-wrap break-all text-left mt-1 pr-14">
                      {message.content}
                    </p>
                  )}

                  {message.sender === "You" && (
                    <div className="absolute top-0 right-0 hidden group-hover:flex items-center gap-2">
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
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
      <div className="flex items-center">
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
            style={{
              minHeight: "40px", // Chiều cao mặc định
              height: "40px",
              maxHeight: "120px", // Giới hạn chiều cao tối đa
            }}
          />

          <button className="p-2 hover:bg-[#404249] rounded-lg">
            <SmilePlus size={20} className="text-gray-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
