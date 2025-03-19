import { useState} from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/echochat_logo.svg";
import { signInWithEmail, signInWithGoogle } from "../../firebase";

//Background image
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";

const Login = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
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
      const user = await signInWithEmail(email, password);
      console.log("Logged in:", user);
      localStorage.setItem("email", email);
      window.location.replace("/");
    } catch (error) {
      setErrorMessage("Đăng nhập thất bại: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google Login:", user);
      window.location.replace("/");
    } catch (error) {
      setErrorMessage("Đăng nhập Google thất bại: " + error.message);
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
      
      {/* Mục Login  */}
      <div
        className={`flex w-[800px] p-6 rounded-lg shadow-lg mx-auto transition-colors ${
          isDarkMode ? "bg-[#2F3136] text-white" : "bg-white text-black border border-gray-300"
        }`}
      >
        <div className={`w-1/2 flex flex-col justify-center items-center border-r p-6 transition-colors ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}>
          <h2 className="text-xl font-bold text-center mb-4">{t('Login with social media account')}</h2>

          <button
            onClick={handleGoogleLogin}
            className={`flex items-center justify-center gap-3 w-full py-2 rounded-md font-semibold shadow-md transition mt-3 ${
              isDarkMode 
                ? "bg-white text-gray-800 hover:bg-gray-300" 
                : "border border-red-500 text-black bg-white hover:bg-gray-100"
            }`}
          >
            <FcGoogle className="text-2xl" />
            {t('Google Login')}
          </button>
        </div>

        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">{t('Welcome back!')}</h2>
          <p className={`text-center mb-6 transition-colors ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>{t('We are excited to see you again!')}</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email"
              className={`p-3 rounded-md border outline-none transition ${
                isDarkMode 
                  ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
                  : "bg-[#F8F9FA] text-black border-gray-300 focus:border-gray-500 shadow-sm"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("Password")}
                className={`p-3 w-full rounded-md border outline-none transition ${
                  isDarkMode 
                    ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
                    : "bg-[#F8F9FA] text-black border-gray-300 focus:border-gray-500 shadow-sm"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button type="submit" className={`font-bold py-2 rounded-md transition ${
              isDarkMode 
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-[#1877F2] hover:bg-[#0D6EFD] text-white"
            }`}>
              {t('Login')}
            </button>
          </form>

          <p className={`text-sm text-center mt-3 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            <Link to="/forgot-password" className="hover:underline transition">
              {t('Forgot password?')}
            </Link>
          </p>
          <p className={`text-sm text-center mt-5 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            {t('Need an account?')}
            <Link to="/signup" className="text-blue-500 hover:underline transition"> {t('Signup')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;




