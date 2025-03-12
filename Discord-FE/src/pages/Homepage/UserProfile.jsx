import { useEffect, useRef } from "react";
import { X, LogOut } from "lucide-react";

export default function UserProfile({ onClose }) {
  const modalRef = useRef(null);

  const handleLogout = () => {
    console.log("Logging out...");
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={handleClickOutside}
    >
      <div ref={modalRef} className="w-full max-w-2xl bg-[#313338] text-gray-100 rounded-md overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#232428]">
          <h1 className="text-xl font-bold">My Account</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#232428]"
            >
              <X size={20} />
              <span className="text-gray-400 text-sm">ESC</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          <div className="w-60 bg-[#2b2d31] p-4">
            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-400 mb-2">USER SETTINGS</div>
              <div className="bg-[#404249] text-white rounded p-2 mb-1">My Account</div>
            </div>
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#ed4245] hover:bg-[#ed4245] hover:text-white p-2 rounded w-full"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="bg-[#232428] rounded-md overflow-hidden mb-6">
              <div className="h-24 bg-[#9b84b7]"></div>
              <div className="px-4 pb-4 relative">
                <div className="flex justify-between items-end">
                  <div className="flex items-end gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#36393f] border-4 border-[#232428] -mt-10 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Gengar_B</h2>
                  </div>
                  <button className="bg-[#5865f2] text-white px-4 py-1 rounded text-sm">Edit User Profile</button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Password and Authentication</h3>
              <button className="bg-[#5865f2] text-white px-4 py-2 rounded text-sm">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
