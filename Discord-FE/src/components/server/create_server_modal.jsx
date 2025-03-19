import { useState } from "react";
import { X } from "lucide-react";

export default function CreateServerModal({ onClose }) {
  const [modalType, setModalType] = useState("main");
  const [serverName, setServerName] = useState("");
  const [serverImage, setServerImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setServerImage(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#313338] rounded-md w-full max-w-md p-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-400 hover:text-gray-100 hover:bg-gray-600"
        >
          <X size={20} />
        </button>

        {modalType === "main" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Server</h2>
              <p className="text-gray-400">
                Your server is where you and your friends hang out. Make yours and start talking.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Create My Own */}
              <button
                onClick={() => setModalType("create")}
                className="w-full bg-[#2b2d31] hover:bg-[#35373c] p-4 rounded-md flex items-center gap-4 transition-colors"
              >
                <div className="text-left">
                  <div className="text-white font-medium">Create My Own</div>
                </div>
                <div className="ml-auto text-gray-400">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              </button>

              {/* Join Server */}
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase mb-2">Have an invite already?</div>
                <button
                  onClick={() => setModalType("join")}
                  className="w-full bg-[#404249] hover:bg-[#35373c] text-white p-2 rounded-md transition-colors"
                >
                  Join a Server
                </button>
              </div>
            </div>
          </>
        )}

        {modalType === "create" && (
          <>
            {/* Customize Your Server */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Customize Your Server</h2>
              <p className="text-gray-400">
                Give your new server a personality with a name and an icon. You can always change it later.
              </p>
            </div>

            {/* Upload Icon */}
            <div className="flex justify-center mb-4">
              <label className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer">
                {serverImage ? (
                  <img src={serverImage} alt="Server Icon" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">UPLOAD</span>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <div className="absolute -bottom-2 right-0 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white">
                  +
                </div>
              </label>
            </div>

            {/* Server Name Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">SERVER NAME</label>
              <input
                type="text"
                className="w-full bg-[#1e1f22] text-white p-2 rounded-md outline-none"
                placeholder="Enter server name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setModalType("main")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">Create</button>
            </div>
          </>
        )}

        {modalType === "join" && (
          <>
            {/* Join a Server */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Join a Server</h2>
              <p className="text-gray-400">Enter an invite below to join an existing server</p>
            </div>

            {/* Invite Link Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">INVITE LINK *</label>
              <input
                type="text"
                className="w-full bg-[#1e1f22] text-white p-2 rounded-md outline-none"
                placeholder="https://discord.gg/example"
              />
            </div>

            {/* Invite Example */}
            <div className="mb-4 text-gray-400 text-sm">
              <p className="mb-1">INVITES SHOULD LOOK LIKE</p>
              <ul className="list-none">
                <li>hTKzmak</li>
                <li>https://discord.gg/hTKzmak</li>
                <li>https://discord.gg/wumpus-friends</li>
              </ul>
            </div>

            {/* No Invite Section */}
            <div className="bg-[#2b2d31] p-3 rounded-md flex items-center">
              <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center text-white mr-2">
                ✅
              </div>
              <span className="text-gray-400 text-sm">Don't have an invite?</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setModalType("main")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                Join Server
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
