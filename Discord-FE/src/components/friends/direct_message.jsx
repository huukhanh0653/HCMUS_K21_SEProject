"use client"

import { useState } from "react"
import { Plus, SmilePlus, Gift, Sticker, ImageIcon } from "lucide-react"

export default function DirectMessage({ friend, messages = [] }) {
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (!messageInput.trim() || !friend) return

    // In a real app, you would send this to your backend
    console.log(`Sending message to ${friend.name}: ${messageInput}`)

    // You could emit an event or call a callback function passed as prop
    // onSendMessage(friend.name, messageInput)

    setMessageInput("")
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden">
                  {message.sender === "You" ? (
                    <img src="/placeholder.svg?height=40&width=40" alt="You" className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={friend.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{message.sender}</span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-100">{message.content}</p>
                </div>
              </div>
            </div>
          ))
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
              This is the beginning of your direct message history with{" "}
              <span className="font-semibold">{friend.name}</span>.
            </p>
          </div>
        )}
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
              placeholder={`Message @${friend.name}`}
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
              <button className="p-2 hover:bg-[#404249] rounded-lg">
                <SmilePlus size={20} className="text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

