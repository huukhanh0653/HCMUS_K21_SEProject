"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, SmilePlus, Gift, Sticker, ImageIcon } from "lucide-react"

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
        avatar: "/placeholder.svg?height=40&width=40",
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
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-4 hover:bg-[#2e3035] rounded p-2 -mx-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden flex-shrink-0">
                <img
                  src={message.user.avatar || "/placeholder.svg"}
                  alt={message.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{message.user.name}</span>
                  <span className="text-xs text-gray-400">{message.timestamp}</span>
                </div>
                <p className="text-gray-100 whitespace-pre-wrap break-words text-left">
                    {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4">
        <div className="bg-[#383a40] rounded-lg">
          <div className="flex items-center p-2">
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Plus size={20} className="text-gray-200" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
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

