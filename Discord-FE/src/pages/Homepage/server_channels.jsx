import { useEffect, useState, useRef } from "react";
import { ChevronDown, Hash, Volume2, Search, UserX, ShieldOff } from "lucide-react";
import UserPanel from "../../components/user_panel";

export default function ServerChannels({ server, onChannelSelect, onProfileClick, selectedChannelId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/50?img=1" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/50?img=2" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
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
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-[#2b2d31] p-4 rounded-md w-96 shadow-lg">
            <h2 className="text-white text-lg font-semibold mb-2">Quản lý thành viên</h2>
            <div className="flex items-center bg-[#1e1f22] p-2 rounded-md mb-2">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thành viên..."
                className="bg-transparent text-white flex-1 ml-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {members
                .filter((member) =>
                  member.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-[#35373c] rounded-md">
                    <div className="flex items-center gap-2">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                      <span className="text-white">{member.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-red-500 hover:text-red-700">
                        <UserX size={20} />
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-700">
                        <ShieldOff size={20} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

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
