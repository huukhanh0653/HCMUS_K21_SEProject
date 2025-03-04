import './App.css';
import Admin from './components/admin/Admin';
import AdminPanel from './components/admin/AdminPanel';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { LanguageProvider, useLanguage } from './components/LanguageProvider';
import { useTranslation } from 'react-i18next';
import Member from './components/admin/Members/Member';

// Component con để dùng hooks trong Provider
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className={theme}>
      {/* Container chứa cả hai nút */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        {/* Nút chuyển đổi ngôn ngữ */}
        <button 
          onClick={toggleLanguage} 
          className="p-2 bg-primary text-white rounded-md shadow-md transition"
        >
          {t("change_language") || "🌍"}
        </button>

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
          <Route path="/admin" element={<Admin key="admin"/>}>
            <Route path="dashboard" element={<AdminPanel key="dashboard"/>} />
            <Route path="member" element={<Member key="member"/>} />
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
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <h1 className="text-2xl font-bold text-blue-500">Hello World</h1>
              <Footer />
            </>
          }
        />
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

         {/* Admin Routes */}
         <Route
          path="/admin/login"
          element={
            <>
              <AdminLogin/>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
