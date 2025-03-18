import { useState } from "react";
import { X, Copy } from "lucide-react";

export default function InviteServerModal({ isOpen, onClose, serverCode }) {
  if (!isOpen) return null;

  const friendsNotInServer = [
    { id: 1, name: "Duy", avatar: "https://i.pravatar.cc/50?img=8" },
    { id: 2, name: "Linh", avatar: "https://i.pravatar.cc/50?img=9" },
    { id: 3, name: "Nam", avatar: "https://i.pravatar.cc/50?img=10" },
  ];

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#2b2d31] w-96 p-5 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">Mời vào server</h2>

        {/* Mã server */}
        <div className="w-full bg-[#1e1f22] p-2 rounded-md flex items-center justify-center mb-2 relative">
            <span className="text-gray-300">{serverCode}</span>
            <button 
                onClick={copyToClipboard} 
                className="absolute right-2 text-gray-400 hover:text-white flex items-center gap-1"
            >
                <Copy size={18} />
            </button>

        </div>
        {copied && <span className="text-green-400 transition-opacity duration-300 mb-4">Đã sao chép</span>}

        {/* Danh sách bạn bè */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {friendsNotInServer.map((friend) => (
            <div key={friend.id} className="flex justify-between items-center bg-[#3b3e45] p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                <span className="text-white">{friend.name}</span>
              </div>
              <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
                Mời
              </button>
            </div>
          ))}
        </div>

        {/* Nút đóng */}
        <button onClick={onClose} className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
          Đóng
        </button>
      </div>
    </div>
  );
}
