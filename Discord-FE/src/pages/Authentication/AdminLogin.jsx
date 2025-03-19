import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";

const AdminLogin = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }

    if (!password) {
      setErrorMessage("Mật khẩu không được để trống");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/AdminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.message || "Admin Login failed");
        return;
      }

      setSuccessMessage(result.message);
      setErrorMessage("");
      localStorage.setItem("email", email);
      window.location.replace("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Có lỗi xảy ra!");
    }
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen w-full py-10"
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #1e1e1e, #3a3a3a)" 
          : "linear-gradient(135deg, #e0e0e0, #ffffff)", 
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-2 mb-6">
        <img src={Logo} alt="EchoChat Logo" className="h-10" />
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent h-12"
          style={{
            backgroundImage: isDarkMode
              ? "linear-gradient(90deg, #a0a0a0, #d0d0d0)"
              : "linear-gradient(90deg, #606060, #404040)",
          }}
        >
          Đăng nhập Admin
        </h1>
      </div>

      {/* Mục admin login */}
      <div
        className="flex w-[800px] p-6 rounded-lg shadow-lg mx-auto"
        style={{
          background: isDarkMode ? "#2F3136" : "#FFFFFF", // Light mode: trắng
          color: isDarkMode ? "white" : "#000000", // Văn bản màu đen trong light mode
          boxShadow: isDarkMode ? "none" : "0 4px 10px rgba(0, 0, 0, 0.1)", // Hiệu ứng nổi
        }}
      >
        {/* Left Side: Admin Info */}
        <div
          className="w-1/2 flex flex-col justify-center items-center border-r p-6"
          style={{
            borderColor: isDarkMode ? "#3a3a3a" : "#E0E0E0", // Viền nhạt hơn trong Light Mode
          }}
        >
          <h2
            className="text-xl font-bold text-center mb-4"
            style={{ color: isDarkMode ? "white" : "#333333" }}
          >
            Truy cập quản trị
          </h2>
          <p className="text-center" style={{ color: isDarkMode ? "#B0B0B0" : "#666666" }}>
            Đăng nhập để quản lý hệ thống EchoChat.
          </p>
        </div>

        {/* Right Side: Admin Login Form */}
        <div className="w-1/2 p-6">
          <h2
            className="text-2xl font-bold text-center mb-4"
            style={{ color: isDarkMode ? "white" : "#333333" }}
          >
            Đăng nhập
          </h2>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            {/* Email Input */}
            <input
              type="text"
              placeholder="Email"
              className="p-3 rounded-md border outline-none transition"
              style={{
                background: isDarkMode ? "#202225" : "#FFFFFF",
                borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                color: isDarkMode ? "white" : "#000000",
                boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="p-3 w-full rounded-md border outline-none transition"
                style={{
                  background: isDarkMode ? "#202225" : "#FFFFFF",
                  borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                  color: isDarkMode ? "white" : "#000000",
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                style={{ color: isDarkMode ? "#B0B0B0" : "#666666" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="font-bold py-2 rounded-md transition shadow-md"
              style={{
                background: isDarkMode ? "#444" : "#1877F2",
                color: "white",
                boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-sm text-center mt-5">
            Không phải Admin?
            <Link
              to="/login"
              className="hover:underline transition"
              style={{ color: isDarkMode ? "#B0B0B0" : "#0D6EFD" }}
            >
              {" "}
              Đăng nhập người dùng
            </Link>
          </p>

          {/* Error & Success Messages */}
          <p className="text-red-500 text-xs text-center mt-2 min-h-[8px]">{errorMessage || "\u00A0"}</p>
          <p className="text-green-500 text-xs text-center mt-2 min-h-[8px]">{successMessage || "\u00A0"}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
