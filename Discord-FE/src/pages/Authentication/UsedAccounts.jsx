import { useState } from "react"
import { MoreVertical, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../components/ThemeProvider"

// Background images
import DarkBackground from "../../assets/darkmode_background.jpg"
import LightBackground from "../../assets/whitemode_background.jpg"

export default function UsedAccounts() {
  const [showDropdown, setShowDropdown] = useState(null)
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  // Sample accounts
  const accounts = [
    { id: 1, username: "crypt_no_good", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, username: "ambatukom123", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, username: "nolink0598", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const handleLogin = (accountId) => {
    console.log(`Logging in with account ${accountId}`)
    navigate("/discord")
  }

  const toggleDropdown = (accountId) => {
    setShowDropdown(showDropdown === accountId ? null : accountId)
  }

  const handleRemoveAccount = (accountId) => {
    console.log(`Removing account ${accountId}`)
    setShowDropdown(null)
  }

  return (
    <div
      className="flex flex-col items-center min-h-screen w-full py-10"
      style={{
        backgroundImage: `url(${isDarkMode ? DarkBackground : LightBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative w-full max-w-md bg-[#2b2d31] rounded-lg shadow-xl p-6 text-gray-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">Hãy chọn một tài khoản</h1>
          <p className="text-gray-400 text-sm">Chọn một tài khoản để đăng nhập hoặc thêm tài khoản mới.</p>
        </div>

        {/* Account list */}
        <div className="space-y-3 mb-6">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between bg-[#36393f] p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#4e5058]">
                  <img src={account.avatar || "/placeholder.svg"} alt={account.username} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium">{account.username}</div>
                  <div className="text-xs text-[#b9bbbe]">Vui lòng đăng nhập lại.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLogin(account.id)}
                  className="bg-[#4e5058] hover:bg-[#5d6067] px-3 py-1 rounded text-sm"
                >
                  Đăng nhập
                </button>
                <div className="relative">
                  <button onClick={() => toggleDropdown(account.id)} className="p-1 rounded hover:bg-[#4e5058]">
                    <MoreVertical size={20} />
                  </button>

                  {showDropdown === account.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-[#18191c] rounded-md shadow-lg z-10 py-1">
                      <button
                        onClick={() => handleRemoveAccount(account.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#4e5058] hover:text-red-300"
                      >
                        Xóa tài khoản
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add account button - updated UI */}
        <button
          className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
          onClick={() => navigate("/login")}
        >
          <Plus size={20} className="mr-2" />
          Thêm tài khoản
        </button>

      </div>
    </div>
  )
}
