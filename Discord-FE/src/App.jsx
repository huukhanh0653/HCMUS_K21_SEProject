import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Authentication
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import AdminLogin from "./pages/Authentication/AdminLogin";

// Pages
import Home from "./pages/Homepage/Home";
import UserProfile from "./pages/Homepage/UserProfile";
import UserPanel from "./components/user_panel";
import Footer from "./components/Footer";

// Admin Components
import Admin from "./components/admin/Admin";
import AdminPanel from "./components/admin/AdminPanel";
import Member from "./components/admin/Members/Member";
import ServerManagement from "./components/admin/Servers/Servers";
import AdminSettings from "./components/admin/AdminSettings/AdminSettings";
import AccountProfile from "./components/admin/Account/AccountProfile";
import AdminAccountSettings from "./components/admin/Account/AccountSettings";

// Main application content component
function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase User:", firebaseUser); // Debugging
  
      if (firebaseUser) {
        console.warn(" user is logged in.");
        console.log("User:", firebaseUser);
        setUser({
          name: firebaseUser.email || "Người dùng",
          avatar: firebaseUser.photoURL || "https://via.placeholder.com/150",
        });
      } else {
        console.warn("No user is logged in.");
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  // Determine if the theme toggle should be shown
  const shouldShowThemeToggle =
    location.pathname.startsWith("/admin") ||
    ["/login", "/signup", "/forgot-password", "/admin/login"].includes(location.pathname);

  // Toggle profile visibility
  const toggleProfile = () => setShowProfile(!showProfile);
  const closeProfile = () => setShowProfile(false);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      {/* User Panel */}
      
      
      {/* Theme toggle button */}
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
        <Route path="/" element={<><Home  user={user} onProfileClick={toggleProfile} />{showProfile && <UserProfile user={user} onClose={closeProfile} />}</>} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<><Signup /><Footer /></>} />
        <Route path="/forgot-password" element={<><ForgotPassword /><Footer /></>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="member" element={<Member />} />
          <Route path="server" element={<ServerManagement />} />
          <Route path="setting" element={<AdminSettings />} />
          <Route path="account/profile" element={<AccountProfile />} />
          <Route path="account/settings" element={<AdminAccountSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

// Wrap the entire app with providers and router
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;