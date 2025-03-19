import { useState } from "react"
import { MoreVertical, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../components/ThemeProvider"
import Logo from "../../assets/echochat_logo.svg";

// Background images
import DarkBackground from "../../assets/darkmode_background.jpg"
import LightBackground from "../../assets/whitemode_background.jpg"

export default function UsedAccounts() {
  const [showDropdown, setShowDropdown] = useState(null)
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  // Sample accounts
  const accounts = [
    { id: 1, username: "crypt_no_good", avatar: "https://i.pravatar.cc/50?img=41" },
    { id: 2, username: "ambatukom123", avatar: "https://i.pravatar.cc/50?img=42" },
    { id: 3, username: "nolink0598", avatar: "https://i.pravatar.cc/50?img=43" },
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
      <div className="flex items-center gap-2 mb-6">
        <img src={Logo} alt="EchoChat Logo" className="h-10" />
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: isDarkMode
              ? "linear-gradient(90deg, #FF8C00, #FFD700)" 
              : "linear-gradient(90deg, #007BFF, #00CFFF)",
          }}
        > 
          EchoChat
        </h1>
      </div>

      {/* Mục Used Account*/}
      <div
        className="relative w-full max-w-md rounded-lg shadow-xl p-6"
        style={{
          background: isDarkMode ? "#2B2D31" : "#FFFFFF",
          color: isDarkMode ? "white" : "#000000",
          boxShadow: isDarkMode ? "none" : "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">Hãy chọn một tài khoản</h1>
          <p style={{ color: isDarkMode ? "#B0B0B0" : "#666666" }}>
            Chọn một tài khoản để đăng nhập hoặc thêm tài khoản mới.
          </p>
        </div>

        {/* Account list */}
        <div className="space-y-3 mb-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: isDarkMode ? "#36393F" : "#F8F9FA",
                color: isDarkMode ? "white" : "#000000",
                boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden"
                  style={{ background: isDarkMode ? "#4E5058" : "#DDDDDD" }}
                >
                  <img src={account.avatar || "/placeholder.svg"} alt={account.username} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium">{account.username}</div>
                  <div className="text-xs" style={{ color: isDarkMode ? "#B9BBBE" : "#666666" }}>
                    Vui lòng đăng nhập lại.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLogin(account.id)}
                  className="px-3 py-1 rounded text-sm"
                  style={{
                    background: isDarkMode ? "#4E5058" : "#007BFF",
                    color: "white",
                    boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Đăng nhập
                </button>
                <div className="relative">
                  <button onClick={() => toggleDropdown(account.id)} className="p-1 rounded">
                    <MoreVertical size={20} />
                  </button>

                  {showDropdown === account.id && (
                    <div
                      className="absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 py-1"
                      style={{
                        background: isDarkMode ? "#18191C" : "#FFFFFF",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <button
                        onClick={() => handleRemoveAccount(account.id)}
                        className="w-full text-left px-4 py-2 text-sm"
                        style={{ color: "red" }}
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

        {/* Add account button */}
        <button
          className="flex items-center justify-center w-full font-bold py-2 rounded-lg transition"
          onClick={() => navigate("/login")}
          style={{
            background: isDarkMode ? "#3BA55D" : "#28A745",
            color: "white",
            boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Plus size={20} className="mr-2" />
          Thêm tài khoản
        </button>
      </div>

    </div>
  )
}
