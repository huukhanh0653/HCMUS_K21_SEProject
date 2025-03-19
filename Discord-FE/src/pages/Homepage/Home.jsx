import { useState, useEffect } from "react"
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
  Hash, 
  UserPlus,
} from "lucide-react"

import DirectMessage from "../../components/friends/direct_message"
import FriendsView from "../../components/friends/friends_view"
import FriendContextMenu from "../../components/friends/friend_context_menu"
import FriendProfile from "../../components/friends/friend_profile"
import ServerChannels from "./server_channels"
import ServerChat from "../../components/server/server_chat"
import ServerMembers from "../../components/server/server_members"
import CreateServerModal from "../../components/server/create_server_modal"

import SampleAvt from "../../assets/sample_avatar.svg"

import { useTheme } from '../../components/ThemeProvider';
import UserPanel from "../../components/user_panel"

export default function Home({user, onProfileClick }) {
  // Dark mode & Light mode toggle
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("friends")
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [selectedProfileFriend, setSelectedProfileFriend] = useState(null)
  const [selectedServer, setSelectedServer] = useState(null)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [showCreateServer, setShowCreateServer] = useState(false)

  // Default channels for servers
  const defaultChannels = [
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "announcements", type: "text" },
    { id: 3, name: "General", type: "voice" },
    { id: 4, name: "Gaming", type: "voice" },
  ]

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

  // Auto-select the first channel when a server is selected
  useEffect(() => {
    if (selectedServer && !selectedChannel) {
      const firstTextChannel = defaultChannels.find((channel) => channel.type === "text")
      if (firstTextChannel) {
        setSelectedChannel(firstTextChannel)
      }
    }
  }, [selectedServer, selectedChannel])

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

  const handleFriendAction = (action, friend) => {
    switch (action) {
      case "profile":
        setSelectedProfileFriend(friend)
        setShowProfile(true)
        break
      case "unfriend":
        console.log(`Unfriend ${friend.name}`)
        break
      case "block":
        console.log(`Block ${friend.name}`)
        break
    }
  }

  const handleServerClick = (server) => {
    setSelectedServer(server)
    setSelectedFriend(null) // Clear selected friend when switching to server view

    // Select the first text channel by default
    const firstTextChannel = defaultChannels.find((channel) => channel.type === "text")
    if (firstTextChannel) {
      setSelectedChannel(firstTextChannel)
    }
  }

  // Add this function to handle channel selection
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel)
  }

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-[#313338] text-gray-100">
      {/* Left sidebar - Server list */}
      <div className="h-full w-[72px] bg-[#1e1f22] flex flex-col items-center pt-3 gap-2">
        {/* Discord DM Button */}
        <div
          className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center mb-2 cursor-pointer hover:rounded-2xl transition-all duration-200 ease-linear"
          onClick={() => {
            setSelectedServer(null)
            setSelectedChannel(null)
          }}
        >
          <MessageSquare className="text-white" size={24} />
        </div>
        <div className="w-12 h-[2px] bg-[#35363c] rounded-full mb-2"></div>

        {/* Server icons */}
        <div className="flex flex-col gap-2 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          {servers.map((server, index) => (
            <div
              key={index}
              className={`group relative w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer ${
                selectedServer?.label === server.label ? "rounded-2xl" : ""
              }`}
              style={{ backgroundColor: server.color }}
              onClick={() => handleServerClick(server)}
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
        <div
          className="w-12 h-12 bg-[#36393f] hover:bg-[#3ba55d] rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer group mb-2"
          onClick={() => setShowCreateServer(true)}
        >
          <Plus className="text-[#3ba55d] group-hover:text-white transition-colors" size={24} />
        </div>
      </div>

      {/* Channel/DM sidebar */}
      {selectedServer ? (
        <ServerChannels
          server={selectedServer}
          onChannelSelect={handleChannelSelect}
          onProfileClick={onProfileClick}
          selectedChannelId={selectedChannel?.id}
        />
      ) : (
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
            <div className="flex flex-col items-start gap-2 mb-2">
              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "friends"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("friends");
                  setSelectedFriend(null);
                }}
              >
                Bạn bè
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "online"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("online")}
              >
                Trực tuyến
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "all"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left flex items-center gap-2 ${
                  isDarkMode ? "bg-green-600 text-white" : "bg-green-500 text-black"
                }`}
              >
                <UserPlus size={16} /> Thêm Bạn
              </button>
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
                <FriendContextMenu key={index} friend={friend} onAction={handleFriendAction}>
                  <div
                    className={`flex items-center gap-2 p-1 rounded hover:bg-[#35373c] cursor-pointer ${
                      selectedFriend === friend.name ? "bg-[#35373c]" : ""
                    }`}
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
                </FriendContextMenu>
              ))}
            </div>
          </div>

          {/* User panel */}
          <UserPanel user={user} onProfileClick={onProfileClick} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 h-full flex flex-col bg-[#313338]">
        {/* Header */}
        <div className="h-12 min-h-[3rem] flex-shrink-0 border-b border-[#232428] flex items-center px-4">
          {selectedServer && selectedChannel ? (
            <>
              {selectedChannel.type === "text" ? (
                <Hash size={20} className="text-gray-400 mr-2" />
              ) : (
                <Volume2 size={20} className="text-gray-400 mr-2" />
              )}
              <span className="font-semibold">{selectedChannel.name}</span>
            </>
          ) : selectedFriendObj ? (
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

        {/* Main content */}
        {selectedServer && selectedChannel ? (
          <div className="flex flex-1">
            <ServerChat channel={selectedChannel} />
            <ServerMembers />
          </div>
        ) : selectedFriendObj ? (
          <DirectMessage friend={selectedFriendObj} messages={mockMessages[selectedFriend] || []} />
        ) : (
          <FriendsView />
        )}
      </div>

      {/* Friend profile modal */}
      {showProfile && selectedProfileFriend && (
        <FriendProfile
          friend={selectedProfileFriend}
          onClose={() => {
            setShowProfile(false)
            setSelectedProfileFriend(null)
          }}
        />
      )}

      {/* Create server modal */}
      {showCreateServer && <CreateServerModal onClose={() => setShowCreateServer(false)} />}
    </div>
  )
}

