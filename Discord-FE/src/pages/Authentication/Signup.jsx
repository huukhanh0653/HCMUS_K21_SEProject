import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";
import { auth, signUpWithEmail } from "../../firebase"; // Firebase auth
import { useTranslation } from "react-i18next";
//Background image
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";
import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
const Signup = () => {
  const { isDarkMode } = useTheme();
  const {t} = useTranslation();
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
  
    // Basic validation
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
      // Signup user
      const user = await signUpWithEmail(email, password);
      if (!user) {
        throw new Error("User creation failed, no user data returned.");
      }
  
      console.log("User UID:", user.uid);
  
      // Call the API to sync user
      const response = await fetch("http://localhost:5001/users/sync-firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email, password: password, phone: phone }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      // Sign out user immediately after signup
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log("User logged out");
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Logout failed:", error.message);
      }
      console.log("User signed out after signup");
      
      setSuccessMessage("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
      setTimeout(() => window.location.replace("/login"), 3000);
    } catch (error) {
      console.error("Signup Error:", error);
      setErrorMessage(error.message || "Đăng ký thất bại!");
    }
  };


  return (
    <div
      className="flex flex-col items-center min-h-screen w-full py-10"
      style={{
        backgroundImage: `url(${isDarkMode ? DarkBackground : LightBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      
      
      {/* Logo + Title */}
      <div className="flex items-center gap-2 mb-6">
        <img src={Logo} alt="EchoChat Logo" className="h-10" />
        <h1
          className="text-4xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: isDarkMode
            ? "linear-gradient(90deg, #FF8C00, #FFD700)" 
            : "linear-gradient(90deg, #007BFF, #00CFFF)",
          }}
        >
          EchoChat
        </h1>
      </div>

      {/* Mục Signup  */}
      <div className={`flex w-[800px] p-6 rounded-lg shadow-lg mx-auto transition-all ${
        isDarkMode ? "bg-[#2F3136] text-white" : "bg-white text-black border border-gray-300"
      }`}>
        {/* Left Side: Signup Info */}
        <div className={`w-1/3 flex flex-col justify-center items-center p-6 border-r transition-all ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}>
          <h2 className="text-xl font-bold text-center mb-4">{t('Join us now')}</h2>
          <p className={`text-center transition-all ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t('Register to connect with friends and EchoChat communities')}
          </p>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">{t('Signup')}</h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              className={`p-3 rounded-md border outline-none transition ${
                isDarkMode
                  ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
                  : "bg-white text-black border-gray-300 focus:border-gray-500"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Phone Input */}
            <input
              type="tel"
              placeholder={t('Phone number')}
              className={`p-3 rounded-md border outline-none transition ${
                isDarkMode
                  ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
                  : "bg-white text-black border-gray-300 focus:border-gray-500"
              }`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('Password')}
                className={`p-3 w-full rounded-md border outline-none transition ${
                  isDarkMode
                    ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
                    : "bg-white text-black border-gray-300 focus:border-gray-500"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('Confirm Password')}
                className={`p-3 w-full rounded-md border outline-none transition ${
                  isDarkMode
                    ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
                    : "bg-white text-black border-gray-300 focus:border-gray-500"
                }`}
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
              className={`font-bold py-2 rounded-md transition ${
                isDarkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-[#0D6EFD] hover:bg-[#0056D2] text-white"
              }`}
            >
              {t("Signup")}
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
          <p className={`text-sm text-center mt-5 transition-all ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            {t('Have an account?')}
            <Link to="/login" className="text-[#0D6EFD] hover:underline transition"> {t("Login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
