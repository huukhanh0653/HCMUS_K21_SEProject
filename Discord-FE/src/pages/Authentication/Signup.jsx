import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";
import { auth, signUpWithEmail } from "../../firebase"; // Firebase auth

const Signup = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]+$/.test(phone);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }
    if (!phone || !validatePhone(phone)) {
      setErrorMessage("Số điện thoại không hợp lệ");
      return;
    }
    if (!password) {
      setErrorMessage("Mật khẩu không được để trống");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await signUpWithEmail(email, password);
      setSuccessMessage("Đăng ký thành công!");
      setTimeout(() => window.location.replace("/login"), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Đăng ký thất bại!");
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
          EchoChat
        </h1>
      </div>

      <div className="flex w-[800px] bg-[#2F3136] p-6 rounded-lg shadow-lg text-white mx-auto">
        {/* Left Side: Signup Info */}
        <div className="w-1/3 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          <h2 className="text-xl font-bold text-center mb-4">Tham gia ngay</h2>
          <p className="text-gray-400 text-center">
            Đăng ký để kết nối với bạn bè và cộng đồng EchoChat.
          </p>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Đăng ký</h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Phone Input */}
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="bg-[#202225] text-white p-3 w-full rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-md transition"
            >
              Đăng ký
            </button>
          </form>

          {/* Error Message */}
          <p className="text-red-500 text-xs text-center mt-2 min-h-[16px]">
            {errorMessage || "\u00A0"}
          </p>

          {/* Success Message */}
          <p className="text-green-500 text-xs text-center mt-2 min-h-[16px]">
            {successMessage || "\u00A0"}
          </p>

          {/* Already have an account? */}
          <p className="text-gray-400 text-sm text-center mt-5">
            Đã có tài khoản?
            <Link to="/login" className="text-gray-300 hover:underline transition"> Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
