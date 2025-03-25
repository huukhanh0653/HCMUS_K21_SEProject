import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";

import Logo from "../../assets/echochat_logo.svg";
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";

// Tách các form thành component
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import VerifyCodeForm from "../../components/auth/VerifyCodeForm";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(9).fill(""));
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    if (countdown === 0) clearInterval(timer);
    return () => clearInterval(timer);
  }, [isCountdownActive, countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/user/forgot-password", { email });
      setMessage("Code sent");
      setStep("code");
      setIsCountdownActive(true);
      setCountdown(60);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCodeChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value.slice(0, 1);
    setCode(newCode);
    if (e.target.value && index < 8) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const codeInput = code.join("");
    try {
      await axios.post("http://localhost:4000/user/verify-code", { email, code: codeInput });
      setMessage("Code verified");
      setStep("password");
    } catch (error) {
      setMessage(error.response?.data?.message || "Code incorrect");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPassword = e.target[0].value;
    const confirmPassword = e.target[1].value;

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/user/reset-password", {
        email,
        newPassword,
      });

      setMessage(res.data.message);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Reset Password",
          text: "You can log in now!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Reset failed");
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
      {/* Header */}
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
          {t("Forgot Password")}
        </h1>
      </div>

      <div
        className="flex w-[800px] p-6 rounded-lg shadow-lg mx-auto"
        style={{
          background: isDarkMode ? "#2F3136" : "#FFFFFF",
          color: isDarkMode ? "white" : "#000000",
        }}
      >
        {/* Left Info */}
        <div className="w-1/3 flex flex-col justify-center items-center border-r p-6"
          style={{
            borderColor: isDarkMode ? "#3a3a3a" : "#E0E0E0",
          }}
        >
          <h2 className="text-xl font-bold text-center mb-4">
            {t("Reset Password")}
          </h2>
          <p className="text-center text-sm">
            {t("Do the following steps to reset your account.")}
          </p>
        </div>

        {/* Right Step Form */}
        <div className="w-2/3 p-6">
          {step === "email" && (
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
              isDarkMode={isDarkMode}
              t={t}
            />
          )}
          {step === "code" && (
            <VerifyCodeForm
              code={code}
              handleCodeChange={handleCodeChange}
              onSubmit={handleCodeSubmit}
              isDarkMode={isDarkMode}
              t={t}
            />
          )}
          {step === "password" && (
            <ResetPasswordForm
              onSubmit={handlePasswordSubmit}
              isDarkMode={isDarkMode}
              t={t}
            />
          )}

          <p className="text-xs text-center mt-3 text-red-500 min-h-[16px]">
            {message || "\u00A0"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
