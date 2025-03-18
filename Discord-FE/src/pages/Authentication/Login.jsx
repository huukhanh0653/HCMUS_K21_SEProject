import { useState} from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/echochat_logo.svg";
import { signInWithEmail, signInWithGoogle, signInWithFacebook } from "../../firebase";

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

  const handleFacebookLogin = async () => {
    try {
      const user = await signInWithFacebook();
      console.log("Facebook Login:", user);
      window.location.replace("/");
    } catch (error) {
      setErrorMessage("Đăng nhập Facebook thất bại: " + error.message);
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
              ? "linear-gradient(90deg, #F5925EFF, #7FFF10FF)"
              : "linear-gradient(90deg, #FF0000FF, #ECECECFF)",
          }}
        > 
          EchoChat
        </h1>
      </div>

      <div className="flex w-[800px] bg-[#2F3136] p-6 rounded-lg shadow-lg text-white mx-auto">
        <div className="w-1/2 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          <h2 className="text-xl font-bold text-center mb-4">{t('Login with social media account')}</h2>

          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-3 w-full py-2 bg-white text-gray-800 rounded-md font-semibold shadow-md hover:bg-gray-300 transition"
          >
            <FaFacebook className="text-2xl text-blue-600" />
            {t('Facebook Login')}
          </button>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full py-2 bg-white text-gray-800 rounded-md font-semibold shadow-md hover:bg-gray-300 transition mt-3"
          >
            <FcGoogle className="text-2xl" />
            {t('Google Login')}
          </button>
        </div>

        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">{t('Welcome back!')}</h2>
          <p className="text-gray-400 text-center mb-6">{t('We are excited to see you again!')}</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email"
              className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("Password")}
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

            <button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-md transition">
              {t('Login')}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-3">
            <Link to="/forgot-password" className="text-gray-300 hover:underline transition">
              {t('Forgot passwork?')}
            </Link>
          </p>
          <p className="text-gray-400 text-sm text-center mt-5">
            {t('Need an account?')}
            <Link to="/signup" className="text-gray-300 hover:underline transition"> {t('Register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;




