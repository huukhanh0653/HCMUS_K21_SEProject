"use client"

import { useState } from "react"
import {
  Plus,
  Mic,
  Headphones,
  Settings,
  MessageSquare,
  Users,
  Gamepad2,
  TreePine,
  BellIcon as Ball,
  Ghost,
  Sword,
  Crown,
  Rocket,
} from "lucide-react"
import DirectMessage from "../../components/friends/direct-message"
import FriendsView from "../../components/friends/friends-view"

export default function Home({ onProfileClick }) {
  const [activeTab, setActiveTab] = useState("friends")
  const [selectedFriend, setSelectedFriend] = useState(null)

  // Mock messages data
  const mockMessages = {
    Levii: [
      { id: 1, sender: "Levii", content: "Hey there!", timestamp: "Today at 1:09 PM" },
      { id: 2, sender: "You", content: "Hi Levii!", timestamp: "Today at 1:10 PM" },
    ],
    Dolphin: [{ id: 1, sender: "Dolphin", content: "How's it going?", timestamp: "Today at 2:30 PM" }],
    // Add more mock messages for other friends
  }

  // Friends data with status
  const friends = [
    { name: "Levii", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Dolphin", status: "idle", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Cutehome", status: "dnd", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Ngoc Tran", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "trstvxmnh", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "s...", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "DraNox", status: "idle", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "MEE6", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  // Server list data with icons and colors
  const servers = [
    { icon: TreePine, color: "#3ba55c", label: "Nature Gaming" },
    { icon: Gamepad2, color: "#5865f2", label: "Gaming Hub" },
    { icon: Ball, color: "#faa61a", label: "Sports Club" },
    { icon: Ghost, color: "#ed4245", label: "Ghost Gaming" },
    { icon: Sword, color: "#9b59b6", label: "RPG Community" },
    { icon: Crown, color: "#f1c40f", label: "Royal Gaming" },
    { icon: Rocket, color: "#e91e63", label: "Space Station" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get the selected friend object
  const selectedFriendObj = selectedFriend ? friends.find((f) => f.name === selectedFriend) : null

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-[#313338] text-gray-100">
      {/* Left sidebar - Server list */}
      <div className="h-full w-[72px] bg-[#1e1f22] flex flex-col items-center pt-3 gap-2">
        {/* Discord DM Button */}
        <div className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center mb-2 cursor-pointer hover:rounded-2xl transition-all duration-200 ease-linear">
          <MessageSquare className="text-white" size={24} />
        </div>
        <div className="w-12 h-[2px] bg-[#35363c] rounded-full mb-2"></div>

        {/* Server icons */}
        <div className="flex flex-col gap-2 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          {servers.map((server, index) => (
            <div
              key={index}
              className="group relative w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: server.color }}
            >
              <server.icon className="text-white" size={24} />
              <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200 -translate-x-2"></div>
              <div className="absolute left-full ml-4 px-3 py-2 bg-black rounded-md text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {server.label}
              </div>
            </div>
          ))}
        </div>

        <div className="w-12 h-[2px] bg-[#35363c] rounded-full my-2"></div>
        <div className="w-12 h-12 bg-[#36393f] hover:bg-[#3ba55d] rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer group mb-2">
          <Plus className="text-[#3ba55d] group-hover:text-white transition-colors" size={24} />
        </div>
      </div>

      {/* Channel/DM sidebar */}
      <div className="h-full w-60 bg-[#2b2d31] flex flex-col">
        <div className="p-3">
          <div className="bg-[#1e1f22] rounded-md flex items-center px-2">
            <input
              type="text"
              placeholder="Tìm hoặc bắt đầu cuộc trò chuyện"
              className="bg-transparent border-none text-sm py-1 w-full focus:outline-none text-gray-300"
            />
          </div>
        </div>

        <div className="px-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`px-2 py-1 rounded ${activeTab === "friends" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#35373c]"}`}
              onClick={() => {
                setActiveTab("friends")
                setSelectedFriend(null)
              }}
            >
              Bạn bè
            </button>
            <button
              className={`px-2 py-1 rounded ${activeTab === "online" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#35373c]"}`}
              onClick={() => setActiveTab("online")}
            >
              Trực tuyến
            </button>
            <button
              className={`px-2 py-1 rounded ${activeTab === "all" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#35373c]"}`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              className={`px-2 py-1 rounded ${activeTab === "pending" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#35373c]"}`}
              onClick={() => setActiveTab("pending")}
            >
              Đang chờ xử lý
            </button>
            <button className="bg-[#248046] text-white px-2 py-1 rounded text-sm">Thêm Bạn</button>
          </div>
        </div>

        <div className="px-2 text-xs text-gray-400 font-semibold flex items-center justify-between">
          <span>TIN NHẮN TRỰC TIẾP</span>
          <Plus size={16} className="cursor-pointer" />
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-1">
            {friends.map((friend, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-1 rounded hover:bg-[#35373c] cursor-pointer ${selectedFriend === friend.name ? "bg-[#35373c]" : ""}`}
                onClick={() => setSelectedFriend(friend.name)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-[#36393f] rounded-full flex-shrink-0 overflow-hidden">
                    <img
                      src={friend.avatar || "/placeholder.svg"}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${getStatusColor(friend.status)}`}
                  ></div>
                </div>
                <span className="text-gray-300">{friend.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User panel */}
        <div className="p-2 bg-[#232428] flex items-center gap-2">
          <div className="w-8 h-8 bg-[#36393f] rounded-full cursor-pointer" onClick={onProfileClick}></div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Hữu Khánh</div>
            <div className="text-xs text-gray-400">Trực tuyến</div>
          </div>
          <div className="flex gap-1">
            <Mic size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
            <Headphones size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
            <Settings size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 h-full flex flex-col bg-[#313338]">
        {/* Header */}
        <div className="h-12 border-b border-[#232428] flex items-center px-4">
          {selectedFriendObj ? (
            <>
              <div className="w-8 h-8 bg-[#36393f] rounded-full mr-2 overflow-hidden">
                <img
                  src={selectedFriendObj.avatar || "/placeholder.svg"}
                  alt={selectedFriendObj.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="font-semibold">{selectedFriendObj.name}</span>
            </>
          ) : (
            <>
              <Users size={20} className="text-gray-400 mr-2" />
              <span className="font-semibold">Bạn bè</span>
            </>
          )}
        </div>

        {/* Main content - either DirectMessage or FriendsView */}
        {selectedFriendObj ? (
          <DirectMessage friend={selectedFriendObj} messages={mockMessages[selectedFriend] || []} />
        ) : (
          <FriendsView />
        )}
      </div>
    </div>
  )
}

