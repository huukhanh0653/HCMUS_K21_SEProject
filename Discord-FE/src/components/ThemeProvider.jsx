import { createContext, useState, useEffect, useContext } from "react";

// Tạo Context để lưu trạng thái theme
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Kiểm tra localStorage để lấy theme đã lưu
  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);

  // Cập nhật class trên <html> mỗi khi theme thay đổi
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Hàm chuyển đổi giữa light/dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook để sử dụng theme dễ dàng hơn
export const useTheme = () => useContext(ThemeContext);
