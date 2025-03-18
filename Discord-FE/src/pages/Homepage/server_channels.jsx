import { useEffect, useState, useRef } from "react";
import { ChevronDown, Hash, Volume2 } from "lucide-react";
import UserPanel from "../../components/user_panel";
import MemberManagementModal from "../../components/server/MemberManagementModal";

export default function ServerChannels({ server, onChannelSelect, onProfileClick, selectedChannelId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const menuRef = useRef(null);

  // Mock channels data
  const channels = [
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "announcements", type: "text" },
    { id: 3, name: "General", type: "voice" },
    { id: 4, name: "Gaming", type: "voice" },
  ];

  // Mock member data
  const members = [
    { id: 1, name: "Alice",   avatar: "https://i.pravatar.cc/50?img=1" },
    { id: 2, name: "Bob",     avatar: "https://i.pravatar.cc/50?img=2" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
    { id: 4, name: "Cò",      avatar: "https://i.pravatar.cc/50?img=4" },
    { id: 5, name: "Giang",   avatar: "https://i.pravatar.cc/50?img=5"},
    { id: 6, name: "Bảo",     avatar: "https://i.pravatar.cc/50?img=6" },
    { id: 7, name: "Khánh",   avatar: "https://i.pravatar.cc/50?img=7"},
  ];

  // Initialize with the first text channel if none is selected
  useEffect(() => {
    if (!selectedChannelId) {
      const firstTextChannel = channels.find((channel) => channel.type === "text");
      if (firstTextChannel) {
        onChannelSelect(firstTextChannel);
      }
    }
  }, [selectedChannelId, onChannelSelect]);

  const handleChannelClick = (channel) => {
    onChannelSelect(channel);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-full w-60 bg-[#2b2d31] flex flex-col relative">
      {/* Server name header */}
      <div
        className="h-12 px-4 flex items-center justify-between border-b border-[#1e1f22] shadow-sm cursor-pointer hover:bg-[#35373c] relative"
        onClick={toggleMenu}
      >
        <h2 className="font-semibold truncate">{server.label}</h2>
        <ChevronDown size={20} className="text-gray-400" />
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-12 left-0 w-full bg-[#2b2d31] border border-[#1e1f22] shadow-md rounded-md overflow-hidden z-10">
          {["Quản lý thành viên", "Quản lý kênh", "Mời vào server", "Xóa server"].map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#35373c] hover:text-white"
              onClick={() => {
                if (option === "Quản lý thành viên") setIsMemberModalOpen(true);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Member Management Modal */}
      <MemberManagementModal 
        members={members} 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)} 
      />

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
  );
}
