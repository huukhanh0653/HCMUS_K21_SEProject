"use client"

import { X, LogOut } from "lucide-react"

export default function Profile({ onClose }) {
  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...")
    // Close the profile modal after logout
    if (onClose) onClose()
    // You would typically redirect to login page here
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-[#313338] text-gray-100 rounded-md overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#232428]">
          <h1 className="text-xl font-bold">My Account</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#232428]"
            >
              <X size={20} />
            </button>
            <span className="text-gray-400 text-sm">ESC</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Left sidebar */}
          <div className="w-60 bg-[#2b2d31] p-4">
            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-400 mb-2">USER SETTINGS</div>
              <div className="bg-[#404249] text-white rounded p-2 mb-1">My Account</div>
            </div>

            {/* Logout button */}
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

          {/* Main content */}
          <div className="flex-1 p-4">
            {/* Tabs */}
            <div className="border-b border-[#232428] mb-4">
              <div className="flex gap-8">
                <button className="pb-4 text-white font-semibold border-b-2 border-white">Security</button>
                <button className="pb-4 text-gray-400">Standing</button>
              </div>
            </div>

            {/* Profile card */}
            <div className="bg-[#232428] rounded-md overflow-hidden mb-6">
              {/* Banner */}
              <div className="h-24 bg-[#9b84b7]"></div>

              {/* Profile info */}
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

            {/* Password section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Password and Authentication</h3>
              <button className="bg-[#5865f2] text-white px-4 py-2 rounded text-sm">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

