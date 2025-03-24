import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./components/LanguageProvider";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AdminRoute, UserRoute, RedirectIfAuthenticated } from "./components/routes/ProtectedRoute";

// Authentication
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import AdminLogin from "./pages/Authentication/AdminLogin";
import UsedAccounts from "./pages/Authentication/UsedAccounts";

// Pages
import Home from "./pages/Homepage/Home";
import UserProfile from "./pages/Homepage/UserProfile";

// Admin Pages
import Admin from "./components/admin/Admin";
import AdminPanel from "./components/admin/AdminPanel";
import Member from "./components/admin/Members/Member";
import ServerManagement from "./components/admin/Servers/Servers";
import AdminSettings from "./components/admin/AdminSettings/AdminSettings";
import AccountProfile from "./components/admin/Account/AccountProfile";
import AdminAccountSettings from "./components/admin/Account/AccountSettings";

// App Content Component
function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.email || "Người dùng",
          avatar: firebaseUser.photoURL || "https://via.placeholder.com/150",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show theme toggle only on specific pages
  const shouldShowThemeToggle =
    location.pathname.startsWith("/admin") ||
    ["/login", "/signup", "/forgot-password", "/admin/login", "/used-accounts"].includes(location.pathname);
  // Toggle profile visibility
  const toggleProfile = () => setShowProfile(!showProfile);
  const closeProfile = () => setShowProfile(false);

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      {/* Theme Toggle */}
      {shouldShowThemeToggle && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-[#656262FF] hover:bg-[#2B2B2BFF] hover:text-white p-2 rounded w-full"
          >
            {language === "en" ? "EN" : "VI"}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 bg-primary text-primary-foreground rounded-md shadow-md transition"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      )}

      {/* Routes */}
      <Routes>
        {/* Public Routes (Prevent logged-in users from accessing) */}
        <Route 
          path="/login" 
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <RedirectIfAuthenticated>
              <Signup />
            </RedirectIfAuthenticated>
          } 
        />
        <Route path="/used-accounts" element={<UsedAccounts />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login"
         element={
          <RedirectIfAuthenticated>
            <AdminLogin />
          </RedirectIfAuthenticated>
         } />

        {/* Protected User Routes */}
        <Route 
          path="/" 
          element={
            <UserRoute>
              <>
                <Home user={user} onProfileClick={toggleProfile} />
                {showProfile && <UserProfile user={user} onClose={closeProfile} />}
              </>
            </UserRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        >
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

// Main App Component
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
