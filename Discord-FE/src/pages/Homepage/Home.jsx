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

export default function Home({ onProfileClick }) {
  const [activeTab, setActiveTab] = useState("friends")

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

              {/* Server hover indicator */}
              <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200 -translate-x-2"></div>

              {/* Server name tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-black rounded-md text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {server.label}
              </div>
            </div>
          ))}
        </div>

        {/* Separator before Add Server button */}
        <div className="w-12 h-[2px] bg-[#35363c] rounded-full my-2"></div>

        {/* Add server button */}
        <div className="w-12 h-12 bg-[#36393f] hover:bg-[#3ba55d] rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer group mb-2">
          <Plus className="text-[#3ba55d] group-hover:text-white transition-colors" size={24} />
        </div>
      </div>

      {/* Channel/DM sidebar */}
      <div className="h-full w-60 bg-[#2b2d31] flex flex-col">
        {/* Search bar */}
        <div className="p-3">
          <div className="bg-[#1e1f22] rounded-md flex items-center px-2">
            <input
              type="text"
              placeholder="Tìm hoặc bắt đầu cuộc trò chuyện"
              className="bg-transparent border-none text-sm py-1 w-full focus:outline-none text-gray-300"
            />
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="px-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`px-2 py-1 rounded ${activeTab === "friends" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#35373c]"}`}
              onClick={() => setActiveTab("friends")}
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

        {/* Direct Messages section */}
        <div className="px-2 text-xs text-gray-400 font-semibold flex items-center justify-between">
          <span>TIN NHẮN TRỰC TIẾP</span>
          <Plus size={16} className="cursor-pointer" />
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-1">
            {["Levii", "Dolphin", "Cutehome", "Ngoc Tran", "trstvxmnh", "s...", "DraNox", "MEE6"].map(
              (friend, index) => (
                <div key={index} className="flex items-center gap-2 p-1 rounded hover:bg-[#35373c] cursor-pointer">
                  <div className="w-8 h-8 bg-[#36393f] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-300">{friend}</span>
                </div>
              ),
            )}
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
          <Users size={20} className="text-gray-400 mr-2" />
          <span className="font-semibold">Bạn bè</span>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-72 h-72 mb-4">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="No friends online"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-400 mt-4">Không có bạn bè nào trực tuyến vào lúc này. Hãy quay lại sau!</p>

          <div className="mt-8 text-gray-300">
            <h2 className="text-xl font-bold mb-2">Đang Hoạt Động</h2>
            <p className="text-gray-400 max-w-md">
              Hiện tại không có cập nhật mới nào cả... Nếu bạn bè của bạn có hoạt động mới, ví dụ như chơi game hoặc trò
              chuyện thoại, chúng tôi sẽ hiển thị hoạt động đó ở đây!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

