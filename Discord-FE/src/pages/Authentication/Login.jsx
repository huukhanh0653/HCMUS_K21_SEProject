import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";

const Login = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
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
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("email", email);
      window.location.replace("/");
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen w-full py-10"
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #1e1e1e, #3a3a3a)" // Dark Grey Gradient
          : "linear-gradient(135deg, #e0e0e0, #ffffff)", // Light Grey Gradient
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-2 mb-6">
        <img src={Logo} alt="EchoChat Logo" className="h-10" />
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: isDarkMode
              ? "linear-gradient(90deg, #a0a0a0, #d0d0d0)" // Dark Mode Grey Gradient
              : "linear-gradient(90deg, #606060, #404040)", // Light Mode Grey Gradient
          }}
        >
          EchoChat
        </h1>
      </div>

      <div className="flex w-[800px] bg-[#2F3136] p-6 rounded-lg shadow-lg text-white mx-auto">
        {/* Left Side: Social Login */}
        <div className="w-1/2 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          <h2 className="text-xl font-bold text-center mb-4">Đăng nhập với mạng xã hội</h2>

          <button className="flex items-center justify-center gap-3 w-full py-2 bg-white text-gray-800 rounded-md font-semibold shadow-md hover:bg-gray-300 transition">
            <FaFacebook className="text-2xl text-blue-600" />
            Đăng nhập bằng Facebook
          </button>
          <button className="flex items-center justify-center gap-3 w-full py-2 bg-white text-gray-800 rounded-md font-semibold shadow-md hover:bg-gray-300 transition mt-3">
            <FcGoogle className="text-2xl" />
            Đăng nhập bằng Google
          </button>
        </div>

        {/* Right Side: Email/Password Login */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Chào mừng trở lại!</h2>
          <p className="text-gray-400 text-center mb-6">Chúng tôi rất vui khi gặp lại bạn!</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

          {/* Forgot Password */}
          <p className="text-gray-400 text-sm text-center mt-3">
            <Link to="/forgot-password" className="text-gray-300 hover:underline transition">
              Quên mật khẩu?
            </Link>
          </p>
          
          {/* Signup Link */}
          <p className="text-gray-400 text-sm text-center mt-5">
            Chưa có tài khoản?
            <Link to="/signup" className="text-gray-300 hover:underline transition"> Đăng ký</Link>
          </p>

          {/* Error Message */}
          <p className="text-red-500 text-xs text-center mt-2 min-h-[16px]">
            {errorMessage || "\u00A0"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
