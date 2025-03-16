import { Mic, Headphones, Settings } from "lucide-react"

export default function UserPanel({ user, onProfileClick }) {
  console.log("🛠️ UserPanel received user:", user);

  if (!user) return null; // Prevents rendering undefined users

  return (
    <div className="p-2 bg-[#232428] flex items-center gap-2">
      <div className="w-8 h-8 bg-[#36393f] rounded-full cursor-pointer" onClick={onProfileClick}>
        <img
          src={user.avatar}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{user.name}</div>
        <div className="text-xs text-gray-400">Trực tuyến</div>
      </div>
      <div className="flex gap-1">
        <Mic size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
        <Headphones size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
        <Settings size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
      </div>
    </div>
  );
}
