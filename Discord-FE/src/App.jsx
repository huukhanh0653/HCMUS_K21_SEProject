import './App.css';
import Admin from './components/admin/Admin';
import AdminPanel from './components/admin/AdminPanel';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { LanguageProvider, useLanguage } from './components/LanguageProvider';
import { useTranslation } from 'react-i18next';
import Member from './components/admin/Members/Member';
import Server from './components/admin/Servers/Servers';
import AdminSettings from './components/admin/AdminSettings/AdminSettings';
import Profile from './components/admin/pages/Profile';
import AdminAccountSettings from './components/admin/Account/AccountSettings';
import AccountProfile from './components/admin/Account/AccountProfile';

// Component con để dùng hooks trong Provider
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className={`${theme} min-h-screen`}>
      {/* Container chứa cả hai nút */}
      <div className="fixed top-4 right-4 sm:top-4 sm:right-4 flex items-center gap-2 z-50">
        {/* Nút chuyển đổi ngôn ngữ */}
        {/*<button 
          onClick={toggleLanguage} 
          className="p-2 bg-primary text-white rounded-md shadow-md transition"
        >
          {t("change_language") || "🌍"}
        </button>*/}

        {/* Nút chuyển đổi theme */}
        <button 
          onClick={toggleTheme} 
          className="p-2 bg-primary text-primary-foreground rounded-md shadow-md transition"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Router */}
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<Admin />}>
            <Route path="dashboard" element={<AdminPanel />} />
            <Route path="member" element={<Member />} />
            <Route path="server" element={<Server />} />
            <Route path="setting" element={<AdminSettings />} />
            <Route path="account/profile" element={<AccountProfile/>} />
            <Route path="account/settings" element={<AdminAccountSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}


// Bọc Provider cho toàn bộ ứng dụng
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
