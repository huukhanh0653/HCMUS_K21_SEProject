import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/layout/ThemeProvider";
import { LanguageProvider } from "./components/layout/LanguageProvider";
import { useLanguage } from "./components/layout/LanguageProvider";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveUserId } from "./redux/authSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  AdminRoute,
  UserRoute,
  RedirectIfAuthenticated,
} from "./components/routes/ProtectedRoute";
import UserService from "./services/UserService";

// Authentication
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/SignUp";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import AdminLogin from "./pages/Authentication/AdminLogin";
import UsedAccounts from "./pages/Authentication/UsedAccounts";
import ChooseUsername from "./pages/Authentication/ChooseUsername";

// Pages
import Home from "./pages/Homepage/Home";

// Admin Pages
import Admin from "./components/admin/Admin";
import AdminPanel from "./components/admin/AdminPanel";
import Member from "./components/admin/Members/Member";
import ServerManagement from "./components/admin/Servers/Servers";
import AdminSettings from "./components/admin/AdminSettings/AdminSettings";
import AccountProfile from "./components/admin/Account/AccountProfile";
import AdminAccountSettings from "./components/admin/Account/AccountSettings";
import { Toaster } from "react-hot-toast";

// App Content Component
function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async (firebaseUser) => {
      if (firebaseUser) {
        const response = await UserService.getUserByEmail(firebaseUser.email);
        localStorage.setItem("user", JSON.stringify(response));
        setUser({
          name: response.username || firebaseUser.email,
          avatar:
            response.avatar ||
            firebaseUser.photoURL ||
            "https://via.placeholder.com/150",
        });
      } else {
        setUser(null);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      fetchUserData(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // Show theme toggle only on specific pages
  const shouldShowThemeToggle =
    location.pathname.startsWith("/admin") ||
    [
      "/login",
      "/signup",
      "/forgot-password",
      "/admin/login",
      "/used-accounts",
      "/choose-username",
    ].includes(location.pathname);
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
        <Route path="/choose-username" element={<ChooseUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/admin/login"
          element={
            <RedirectIfAuthenticated>
              <AdminLogin />
            </RedirectIfAuthenticated>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/*"
          element={
            <UserRoute>
              <>
                <Home user={user} />
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
          <Route path="" element={<AdminPanel />} />
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(saveUserId());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
