import "./App.css"
import Admin from "./components/admin/Admin"
import AdminPanel from "./components/admin/AdminPanel"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider, useTheme } from "./components/ThemeProvider"
import { LanguageProvider } from "./components/LanguageProvider"
import { useTranslation } from "react-i18next"
import Member from "./components/admin/Members/Member"

// Authentication
import Login from "./pages/Authentication/Login"
import Signup from "./pages/Authentication/Signup"
import ForgotPassword from "./pages/Authentication/ForgotPassword"
import Footer from "./components/Footer"
import AdminLogin from "./pages/Authentication/AdminLogin"

import Home from "./pages/Homepage/Home"
import UserProfile from "./pages/Homepage/UserProfile"
import { useState } from "react"

// Import Admin
import Server from './components/admin/Servers/Servers';
import AdminSettings from './components/admin/AdminSettings/AdminSettings';
import Profile from './components/admin/pages/Profile';
import AdminAccountSettings from './components/admin/Account/AccountSettings';
import AccountProfile from './components/admin/Account/AccountProfile';
import ServerManagement from "./components/admin/Servers/Servers"

// Component con để dùng hooks trong Provider
function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const [showProfile, setShowProfile] = useState(false)
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Xác định xem có cần hiển thị nút theme toggle không
  const shouldShowThemeToggle = 
    location.pathname.startsWith("/admin") || 
    ["/login", "/signup", "/forgot-password", "/admin/login"].includes(location.pathname);

  // Function to toggle profile visibility
  const toggleProfile = () => {
    setShowProfile(!showProfile)
  }

  // Function to close profile
  const closeProfile = () => {
    setShowProfile(false)
  }

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      {/* Chỉ hiển thị nút chuyển đổi theme trên các trang Authentication & Admin */}
      {shouldShowThemeToggle && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 bg-primary text-primary-foreground rounded-md shadow-md transition"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      )}

      {/* Router */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Home onProfileClick={toggleProfile} />
              {showProfile && <UserProfile onClose={closeProfile} />}
            </>
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <>
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Signup />
              <Footer />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <ForgotPassword />
              <Footer />
            </>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Wrap LanguageProvider only around main content */}
        <Route
          path="/*"
          element={
            <ThemeProvider>
              <LanguageProvider>
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin" element={<Admin key="admin" />}>
                    <Route path="dashboard" element={<AdminPanel key="dashboard" />} />
                    <Route path="member" element={<Member key="member" />} />
                    <Route path="server" element={<ServerManagement key="server" />} />
                    <Route path="setting" element={<AdminSettings key="setting" />} />
                    <Route path="account/profile" element={<AccountProfile key="profile" />} />
                    <Route path="account/settings" element={<AdminAccountSettings key="settings" />} />
                  </Route>
                </Routes>
              </LanguageProvider>
            </ThemeProvider>
          }
        />
      </Routes>
    </div>
  )
}

// Bọc Provider cho toàn bộ ứng dụng
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
