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
          className="text-4xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: isDarkMode
              ? "linear-gradient(90deg, #a0a0a0, #d0d0d0)"
              : "linear-gradient(90deg, #606060, #404040)",
          }}
        >
          Đăng nhập Admin
        </h1>
      </div>

      <div className="flex w-[800px] bg-[#2F3136] p-6 rounded-lg shadow-lg text-white mx-auto">
        {/* Left Side: Admin Info */}
        <div className="w-1/2 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          <h2 className="text-xl font-bold text-center mb-4">Truy cập quản trị</h2>
          <p className="text-gray-400 text-center">
            Đăng nhập để quản lý hệ thống EchoChat.
          </p>
        </div>

        {/* Right Side: Admin Login Form */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            {/* Email Input */}
            <input
              type="text"
              placeholder="Email"
              className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="bg-[#202225] text-white p-3 w-full rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-md transition"
            >
              Đăng nhập
            </button>
          </form>

          {/* Error Message */}
          <p className="text-red-500 text-xs text-center mt-2 min-h-[16px]">{errorMessage || "\u00A0"}</p>

          {/* Success Message */}
          <p className="text-green-500 text-xs text-center mt-2 min-h-[16px]">{successMessage || "\u00A0"}</p>

          {/* Forgot Password & Back to Login */}
          <p className="text-gray-400 text-sm text-center mt-5">
            <Link to="/forgot-password" className="text-gray-300 hover:underline transition">
              Quên mật khẩu?
            </Link>
          </p>

          <p className="text-gray-400 text-sm text-center mt-5">
            Không phải Admin?
            <Link to="/login" className="text-gray-300 hover:underline transition"> Đăng nhập người dùng</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
