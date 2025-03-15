"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, SmilePlus, Gift, Sticker, ImageIcon, Edit, Trash2 } from "lucide-react"
import SampleAvt from "../../assets/sample_avatar.svg"

export default function ServerChat({ channel }) {
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: {
        name: "Giang",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "chi tiết yêu cầu thuyết trình giữa kì:\n\nDemo bảng đồ án của nhóm các công cụ nhóm sử dụng để đảm bảo coding standards.\nDemo bảng đồ án của nhóm các UI frameworks, libraries và components nhóm sử dụng để tăng tốc độ phát triển và đảm bảo chất lượng giao diện hệ thống.",
      timestamp: "2/25/2025 6:12 PM",
    },
    {
      id: 2,
      user: {
        name: "qduyisme",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "tui đi toilet cái, có gì nhớ @Hữu Khánh add cái schema lên đây vs bên trello lun nha",
      timestamp: "3/10/2025 10:26 AM",
    },
  ])
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editedContent, setEditedContent] = useState("")
  const inputRef = useRef(null)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: SampleAvt,
      },
      content: messageInput,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }

    setMessages([...messages, newMessage])
    setMessageInput("")

    // Reset textarea height after sending message
    if (inputRef.current) {
      inputRef.current.style.height = "40px" // Reset to default height
    }
  }

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter((message) => message.id !== id))
  }

  const handleEditMessage = (id, content) => {
    setEditingMessageId(id)
    setEditedContent(content)
  }

  const handleSaveEdit = (id) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, content: editedContent } : message
      )
    )
    setEditingMessageId(null)
    setEditedContent("")
  }

  return (
    <div className="flex-1 flex flex-col relative ">
      {/* Messages area with scrollbar */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)] p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((message) => (
          <div key={message.id} className="mb-4 hover:bg-[#2e3035] rounded p-2 -mx-2">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden flex-shrink-0">
                <img
                  src={message.user.avatar || "/placeholder.svg"}
                  alt={message.user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{message.user.name}</span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>

                  {/* Edit & Delete Icons (Only for 'You') */}
                  {message.user.name === "You" && (
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
                    className="w-full bg-[#404249] text-gray-100 p-2 mt-1 rounded-md focus:outline-none resize-none break-words whitespace-pre-wrap"
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

      {/* Message Input */}
      <div >
        <div className="bg-[#383a40] rounded-lg">
          <div className="flex items-center p-2">
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Plus size={20} className="text-gray-200" />
            </button>
            <textarea
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto"
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-hidden min-h-[40px] max-h-[120px]"
              rows={1}
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
    </div>
  )
}
