import './App.css';
import Admin from './components/admin/Admin';
import AdminPanel from './components/admin/AdminPanel';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { LanguageProvider, useLanguage } from './components/LanguageProvider';
import { useTranslation } from 'react-i18next';
import Member from './components/admin/Members/Member';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import Footer from './components/Footer';
import AdminLogin from './pages/Authentication/AdminLogin';

// Component con để dùng hooks trong Provider
function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      {/* Container chứa cả hai nút */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        {/* Nút chuyển đổi theme */}
        <button 
          onClick={toggleTheme} 
          className="p-2 bg-primary text-primary-foreground rounded-md shadow-md transition"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Router */}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><h1 className="text-2xl font-bold text-blue-500">Hello World</h1><Footer /></>} />

          {/* Authentication Routes (No LanguageProvider here) */}
          <Route path="/login" element={<><Login /><Footer /></>} />
          <Route path="/signup" element={<><Signup /><Footer /></>} />
          <Route path="/forgot-password" element={<><ForgotPassword /><Footer /></>} />
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
                    </Route>
                  </Routes>
                </LanguageProvider>
              </ThemeProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Bọc Provider cho toàn bộ ứng dụng
function App() {
  return (
      <AppContent />
  );
}

export default App;
