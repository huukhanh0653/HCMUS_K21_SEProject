import { useEffect } from "react"
import { ChevronDown, Hash, Volume2 } from "lucide-react"
import UserPanel from "../../components/user_panel"

export default function ServerChannels({ server, onChannelSelect, onProfileClick, selectedChannelId }) {
  // Mock channels data
  const channels = [
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "announcements", type: "text" },
    { id: 3, name: "General", type: "voice" },
    { id: 4, name: "Gaming", type: "voice" },
  ]

  // Initialize with the first text channel if none is selected
  useEffect(() => {
    if (!selectedChannelId) {
      const firstTextChannel = channels.find((channel) => channel.type === "text")
      if (firstTextChannel) {
        onChannelSelect(firstTextChannel)
      }
    }
  }, [selectedChannelId, onChannelSelect])

  const handleChannelClick = (channel) => {
    onChannelSelect(channel)
  }

  return (
    <div className="h-full w-60 bg-[#2b2d31] flex flex-col">
      {/* Server name header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#1e1f22] shadow-sm cursor-pointer hover:bg-[#35373c]">
        <h2 className="font-semibold truncate">{server.label}</h2>
        <ChevronDown size={20} className="text-gray-400" />
      </div>

      {/* Channels list */}
      <div className="flex-1 overflow-y-auto pt-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleChannelClick(channel)}
            className={`w-full px-2 py-1.5 flex items-center gap-2 text-gray-400 hover:bg-[#35373c] hover:text-gray-200 ${
              selectedChannelId === channel.id ? "bg-[#35373c] text-white" : ""
            }`}
          >
            {channel.type === "text" ? <Hash size={20} /> : <Volume2 size={20} />}
            <span className="text-sm font-medium">{channel.name}</span>
          </button>
        ))}
      </div>

      {/* User panel */}
      <UserPanel onProfileClick={onProfileClick} />
    </div>
  )
}

