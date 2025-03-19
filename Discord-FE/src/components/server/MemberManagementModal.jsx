import { useState, useEffect } from "react";
import { Search, UserX, ShieldOff } from "lucide-react";

export default function MemberManagementModal({ members, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [memberList, setMemberList] = useState(members); // Danh sách thành viên có thể cập nhật

  // Đóng modal khi ấn ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Hàm xử lý kick
  const handleKick = (id) => {
    setMemberList(memberList.filter((member) => member.id !== id));
  };

  // Hàm xử lý ban
  const handleBan = (id) => {
    setMemberList(memberList.filter((member) => member.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-[#2b2d31] p-4 rounded-md w-96 shadow-lg">
        <h2 className="text-white text-lg font-semibold mb-2">Quản lý thành viên</h2>

        {/* Search Bar */}
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

        {/* Members List */}
        <div 
          className="max-h-60 overflow-y-auto pt-3"
          style={{
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: "grey transparent", // Firefox
          }}
        >
          {memberList
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
                  {/* Kick Button */}
                  <button 
                    className="text-red-500 hover:text-red-700 relative group"
                    onClick={() => handleKick(member.id)}
                  >
                    <UserX size={20} />
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Kick
                    </span>
                  </button>
                  
                  {/* Ban Button */}
                  <button 
                    className="text-yellow-500 hover:text-yellow-700 relative group"
                    onClick={() => handleBan(member.id)}
                  >
                    <ShieldOff size={20} />
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Ban
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
