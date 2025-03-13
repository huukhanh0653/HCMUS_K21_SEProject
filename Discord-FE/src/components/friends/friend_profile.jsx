import { useState, useRef, useEffect } from "react"
import { X, MessageSquare, UserPlus, UserMinus, Ban } from "lucide-react"

export default function FriendProfile({ friend, onClose, isFriend = true }) {
  const modalRef = useRef(null)
  const [activeTab, setActiveTab] = useState("about")

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onClose) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const handleAction = (action) => {
    console.log(`${action} user:`, friend.name)
    // Handle the action (unfriend, block, etc.)
    if (action === "message") {
      // Handle starting a DM
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClickOutside}>
      <div ref={modalRef} className="w-full max-w-2xl bg-[#313338] text-gray-100 rounded-md overflow-hidden">
        {/* Header */}
        <div className="relative h-60">
          {/* Banner */}
          <div className="h-40 bg-[#9b84b7]">
            {friend.wallpaper && (
              <img
                src={friend.wallpaper || "/placeholder.svg"}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#232428]"
          >
            <X size={20} />
            <span className="text-gray-400 text-sm">ESC</span>
          </button>

          {/* Avatar */}
          <div className="absolute left-6 bottom-0">
            <div className="w-[120px] h-[120px] rounded-full bg-[#36393f] border-8 border-[#313338] overflow-hidden">
              <img
                src={friend.avatar || "/placeholder.svg?height=120&width=120"}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Status indicator */}
            <div
              className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-8 border-[#313338] ${
                friend.status === "online"
                  ? "bg-green-500"
                  : friend.status === "idle"
                    ? "bg-yellow-500"
                    : friend.status === "dnd"
                      ? "bg-red-500"
                      : "bg-gray-500"
              }`}
            ></div>
          </div>

          {/* Action buttons */}
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              onClick={() => handleAction("message")}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Message
            </button>
            {isFriend ? (
              <button
                onClick={() => handleAction("unfriend")}
                className="bg-[#2b2d31] hover:bg-[#ed4245] hover:text-white text-[#ed4245] px-4 py-2 rounded-md flex items-center gap-2"
              >
                <UserMinus size={20} />
                Unfriend
              </button>
            ) : (
              <button
                onClick={() => handleAction("add_friend")}
                className="bg-[#248046] hover:bg-[#1a6334] text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <UserPlus size={20} />
                Add Friend
              </button>
            )}
            <button
              onClick={() => handleAction("block")}
              className="bg-[#2b2d31] hover:bg-[#ed4245] hover:text-white text-[#ed4245] px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Ban size={20} />
              Block
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">{friend.name}</h2>

          {/* Tabs */}
          <div className="border-b border-[#232428] mb-4">
            <div className="flex gap-4">
              <button
                className={`pb-2 ${activeTab === "about" ? "text-white border-b-2 border-white font-semibold" : "text-gray-400"}`}
                onClick={() => setActiveTab("about")}
              >
                About Me
              </button>
              <button
                className={`pb-2 ${activeTab === "mutual_friends" ? "text-white border-b-2 border-white font-semibold" : "text-gray-400"}`}
                onClick={() => setActiveTab("mutual_friends")}
              >
                Mutual Friends
              </button>
              <button
                className={`pb-2 ${activeTab === "mutual_servers" ? "text-white border-b-2 border-white font-semibold" : "text-gray-400"}`}
                onClick={() => setActiveTab("mutual_servers")}
              >
                Mutual Servers
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="space-y-4">
            {activeTab === "about" && (
              <>
                <div className="flex items-center text-gray-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase w-32">Member Since:</h3>
                  <p>Jul 2, 2017</p>
                </div>
                {friend.email && (
                  <div className="flex items-center text-gray-200">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase w-32">Email:</h3>
                    <p>{friend.email}</p>
                  </div>
                )}
                {friend.phone && (
                  <div className="flex items-center text-gray-200">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase w-32">Phone:</h3>
                    <p>{friend.phone}</p>
                  </div>
                )}
              </>
            )}
            {activeTab === "mutual_friends" && <p className="text-gray-400">No mutual friends</p>}
            {activeTab === "mutual_servers" && <p className="text-gray-400">No mutual servers</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

