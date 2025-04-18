import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../../components/layout/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";
import { useTranslation } from "react-i18next";
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom"; // 👈 Add this at the top

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: t("Email Sent!"),
        text: t("Check your inbox for the reset password link."),
        timer: 3000,
        showConfirmButton: false,
      });
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
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
          {t("Forgot password")}
        </h1>
      </div>

      <div
        className="flex w-[800px] p-6 rounded-lg shadow-lg mx-auto"
        style={{
          background: isDarkMode ? "#2F3136" : "#FFFFFF",
          color: isDarkMode ? "white" : "#000000",
          boxShadow: isDarkMode ? "none" : "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Side */}
        <div
          className="w-1/3 flex flex-col justify-center items-center border-r p-6"
          style={{ borderColor: isDarkMode ? "#3a3a3a" : "#E0E0E0" }}
        >
          <h2 className="text-xl font-bold text-center mb-4">
            {t("Reset password")}
          </h2>
          <p className="text-center" style={{ color: isDarkMode ? "#B0B0B0" : "#666666" }}>
            {t("Do the following steps to reset your account.")}
          </p>
        </div>

        {/* Right Side: Email Input */}
        <div className="w-2/3 p-6">
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder={t("Enter email")}
              className="p-3 rounded-md border outline-none transition"
              style={{
                background: isDarkMode ? "#202225" : "#FFFFFF",
                borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                color: isDarkMode ? "white" : "#000000",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="font-bold py-2 rounded-md transition"
              style={{
                background: isDarkMode ? "#444" : "#1877F2",
                color: "white",
              }}
            >
              {t("Confirm")}
            </button>
          </form>

          {/* Message */}
          <p className="text-xs text-center mt-2 min-h-[16px]" style={{ color: "red" }}>
            {message || "\u00A0"}
          </p>
          {/* Back to Login link */}
          <p className="text-sm text-center mt-2 ">
              {t("Remember your password?")}&nbsp;
              <Link to="/login" className="text-blue-500 hover:underline">
                {t("Go to Login")}
              </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
