"use client"

import { useState, useRef, useEffect } from "react"
import { io } from "socket.io-client"
import { Plus, SmilePlus, Gift, Sticker, ImageIcon, Edit, Trash2 } from "lucide-react"
import SampleAvt from "../../assets/sample_avatar.svg"
import { useTranslation } from "react-i18next"
const socket = io("http://localhost:5000") // Replace with your server URL

export default function ServerChat({ channel }) {
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState([])
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editedContent, setEditedContent] = useState("")
  const inputRef = useRef(null)
  const {t, i18n} = useTranslation();
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    console.log("default-channel")
    // Join the channel room
    socket.emit("joinChannel", "default-channel")

    // Listen for previous messages
    socket.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages)
    })

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage])
    })
    socket.on('messageUpdated', (data) => {
      setMessages((prev) => prev.map((msg) => (msg.message_id === data.message_id ? data : msg)));
    });
    socket.on('messageDeleted', (data) => {
      setMessages((prev) => prev.filter((msg) => msg.message_id !== data.message_id));
    });

    return () => {
      socket.off()
    }
  }, ["default-channel"])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const [pretime_stamp, SetPretime_stamp] = useState();
  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage = {
      channel_id: "default-channel",
      sender_id: "currentUserId", // Replace with the actual user ID
      content: messageInput,
      timestamp: Date.now(), // Lưu timestamp để so sánh
      attachments: [],
    }

    socket.emit("sendMessage", newMessage)
    setMessageInput("")

    // Reset textarea height after sending message
    if (inputRef.current) {
      inputRef.current.style.height = "40px" // Reset to default height
    }
  }

  const handleDeleteMessage = (id) => {
    socket.emit('deleteMessage', { channel_id: "default-channel", message_id: id }); 
  }

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id)
    setEditedContent(content)
  }

  const handleSaveEdit = (id) => {
    if (!editedContent.trim()) return;

    socket.emit('editMessage', {
        channel_id: "default-channel",
        message_id: id,
        content: editedContent,
        attachments: []
    });
    setEditingMessageId(null);
    setEditedContent("");
  };

  return (
    <div className="flex-1 flex flex-col relative ">
      {/* Messages area with scrollbar */}
      <div 
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        style={{
          minHeight: "200px",  // Ensures it doesn't collapse completely
          maxHeight: "calc(100vh - 100px)", // Adjust height dynamically without overflow
          scrollbarWidth: "thin", // Firefox scrollbar styling
          scrollbarColor: "grey transparent", // Firefox scrollbar color
        }}
      >
        {messages.map((message, index) => {
          const previous = messages[index - 1];

          const currentDate = new Date(message.timestamp);
          const currentDay = currentDate.toDateString(); // so sánh theo ngày
          const previousDay = previous ? new Date(previous.timestamp).toDateString() : null;

          const showDateDivider = currentDay !== previousDay;

          const currentTime = currentDate.getTime();
          const previousTime = previous ? new Date(previous.timestamp).getTime() : null;

          const isGrouped =
            previous &&
            previous.sender_id === message.sender_id &&
            previousDay === currentDay &&
            previousTime &&
            currentTime - previousTime <= 60000;

          const formattedDate = currentDate.toLocaleDateString(i18n.language || "vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });


          const formattedTime = currentDate.toLocaleTimeString(i18n.language || "vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <div key={message.message_id} className={`mb-2 ${!isGrouped ? "pt-4" : ""}`}>
              {/* Divider ngày */}
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
                        src={message.sender_avatar || SampleAvt}
                        alt={message.sender_name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.sender_id}</span>
                          <span className="text-xs text-gray-400">{formattedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${isGrouped ? "pl-14" : "pl-14 mt-1"} relative`}>
                  {editingMessageId === message.message_id ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full bg-[#404249] text-gray-100 p-2 mt-1 rounded-md focus:outline-none resize-none break-words whitespace-pre-wrap pr-14"
                      rows={2}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit(message.message_id);
                        }
                      }}
                    />
                  ) : (
                    <p className="text-gray-100 break-words whitespace-pre-wrap break-all text-left mt-1 pr-14">
                      {message.content}
                    </p>
                  )}

                  {message.sender_id === "currentUserId" && (
                    <div className="absolute top-0 right-0 hidden group-hover:flex items-center gap-2">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-200"
                        onClick={() => handleEditMessage(message.message_id, message.content)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteMessage(message.message_id)}
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

      {/* Message Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
        <div className="flex items-center">
          <button className="p-2 hover:bg-[#404249] rounded-lg">
            <Plus size={20} className="text-gray-200" />
          </button>
          <textarea
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "40px"; // Reset height về mặc định
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; // Không vượt quá 120px
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`${t('Message #')}${channel.name}`}
            className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-y-auto"
            style={{
              minHeight: "40px", // Chiều cao mặc định
              height: "40px",
              maxHeight: "120px", // Giới hạn chiều cao tối đa
            }}
          />
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Gift size={20} className="text-gray-200" />
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <ImageIcon size={20} className="text-gray-200" />
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Sticker size={20} className="text-gray-200" />
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg" onClick={handleSendMessage}>
              <SmilePlus size={20} className="text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
