  // pages/Authentication/Login.jsx
  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import Logo from "../../assets/echochat_logo.svg";
  import DarkBackground from "../../assets/darkmode_background.jpg";
  import LightBackground from "../../assets/whitemode_background.jpg";
  import { useTheme } from "../../components/layout/ThemeProvider";
  import { useTranslation } from "react-i18next";

  import LoginForm from "../../components/auth/LoginForm";
  import SocialLogin from "../../components/auth/SocialLogin";

  const Login = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState("");
    const handleSuccess = () => navigate("/");
    const handleError = (message) => setErrorMessage(message);

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

        <div
          className={`relative flex w-[800px] p-6 rounded-lg shadow-lg mx-auto transition-colors ${
            isDarkMode ? "bg-[#2F3136] text-white" : "bg-white text-black border border-gray-300"
          }`}
        >
          <button
            onClick={() => navigate("/used-accounts")}
            className="absolute top-3 left-4 text-xs text-blue-400 hover:underline"
          >
            {t("Used accounts?")}
          </button>

          <div className={`w-1/2 flex flex-col justify-center items-center border-r p-6 transition-colors ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <h2 className="text-xl font-bold text-center mb-4">{t('Login with social media account')}</h2>

            <SocialLogin onSuccess={handleSuccess} onError={handleError} />
          </div>

          <div className="w-1/2 p-6">
            <h2 className="text-2xl font-bold text-center mb-4">{t("Welcome back!")}</h2>
            <p className={`text-center mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("We are excited to see you again!")}
            </p>

            <LoginForm onSuccess={handleSuccess} onError={handleError} />

            {errorMessage && (
              <p className="text-sm text-center mt-2 text-red-500">{errorMessage}</p>
            )}

            <p className={`text-sm text-center mt-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              <Link to="/forgot-password" className="hover:underline transition">
                {t("Forgot password?")}
              </Link>
            </p>
            <p className={`text-sm text-center mt-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("Need an account?")}
              <Link to="/signup" className="text-blue-500 hover:underline transition"> {t("Signup")}</Link>
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default Login;
