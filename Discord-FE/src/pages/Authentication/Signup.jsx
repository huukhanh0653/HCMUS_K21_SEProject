import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/echochat_logo.svg";
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";
import SignupForm from "../../components/auth/SignupForm";

const Signup = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        className={`flex w-[800px] p-6 rounded-lg shadow-lg mx-auto ${
          isDarkMode ? "bg-[#2F3136] text-white" : "bg-white text-black border border-gray-300"
        }`}
      >
        <div className={`w-1/3 flex flex-col justify-center items-center p-6 border-r ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}>
          <h2 className="text-xl font-bold text-center mb-4">{t("Join us now")}</h2>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {t("Register to connect with friends and EchoChat communities")}
          </p>
        </div>

        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">{t("Signup")}</h2>

          <SignupForm
            onError={(msg) => {
              setSuccessMessage("");
              setErrorMessage(msg);
            }}
            onSuccess={(msg) => {
              setErrorMessage("");
              setSuccessMessage(msg);
            }}
          />

          <p className="text-red-500 text-xs text-center mt-2 min-h-[16px]">
            {errorMessage || "\u00A0"}
          </p>
          <p className="text-green-500 text-xs text-center mt-2 min-h-[16px]">
            {successMessage || "\u00A0"}
          </p>

          <p className={`text-sm text-center mt-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t("Have an account?")}
            <Link to="/login" className="text-[#0D6EFD] hover:underline transition"> {t("Login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
