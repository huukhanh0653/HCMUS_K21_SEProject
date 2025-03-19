import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../../components/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";
import { useTranslation } from "react-i18next";
//Background image
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(9).fill(""));
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("email");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const {t} = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0) {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCountdownActive, countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      /* set this one later
      const response = await axios.post(`http://localhost:4000/user/forgot-password`, { email });
      setMessage(response.data.message); */
      setStep("code");
      setIsCountdownActive(true);
      setCountdown(60);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleCodeChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value.slice(0, 1);
    setCode(newCode);
    if (e.target.value !== "" && index < 8) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const codeInput = code.join("");
    try {
      /*set it later when api set up
      const response = await axios.post(`http://localhost:4000/user/verify-code`, { email, code: codeInput });
      setMessage(response.data.message); */
      setStep("password");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPassword = e.target[0].value;
    const confirmPassword = e.target[1].value;

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/user/reset-password`, { email, newPassword });
      setMessage(response.data.message);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Update Password Successful!",
          text: "You can log in now!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
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
          {t('Forgot password')}
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
        {/* Left Side: Info */}
        <div
          className="w-1/3 flex flex-col justify-center items-center border-r p-6"
          style={{
            borderColor: isDarkMode ? "#3a3a3a" : "#E0E0E0",
          }}
        >
          <h2
            className="text-xl font-bold text-center mb-4"
            style={{ color: isDarkMode ? "white" : "#333333" }}
          >
            {t("Reset password")}
          </h2>
          <p className="text-center" style={{ color: isDarkMode ? "#B0B0B0" : "#666666" }}>
            {t('Do the following steps to reset your account.')}
          </p>
        </div>

        {/* Right Side: Form Steps */}
        <div className="w-2/3 p-6">
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder={t("Enter email")}
                className="p-3 rounded-md border outline-none transition"
                style={{
                  background: isDarkMode ? "#202225" : "#FFFFFF",
                  borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                  color: isDarkMode ? "white" : "#000000",
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
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
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {t('Confirm')}
              </button>
            </form>
          ) : step === "code" ? (
            <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-9 gap-2 mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e, index)}
                    className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none transition"
                    style={{
                      background: isDarkMode ? "#202225" : "#FFFFFF",
                      borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                      color: isDarkMode ? "white" : "#000000",
                      boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="font-bold py-2 rounded-md transition w-full"
                style={{
                  background: isDarkMode ? "#444" : "#1877F2",
                  color: "white",
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {t('Confirm code')}
              </button>
            </form>
          ) : step === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder={t("Enter new password")}
                className="p-3 rounded-md border outline-none transition"
                style={{
                  background: isDarkMode ? "#202225" : "#FFFFFF",
                  borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                  color: isDarkMode ? "white" : "#000000",
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              />
              <input
                type="password"
                placeholder={t('Confirm new password')}
                className="p-3 rounded-md border outline-none transition"
                style={{
                  background: isDarkMode ? "#202225" : "#FFFFFF",
                  borderColor: isDarkMode ? "#3a3a3a" : "#CCCCCC",
                  color: isDarkMode ? "white" : "#000000",
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              />
              <button
                type="submit"
                className="font-bold py-2 rounded-md transition"
                style={{
                  background: isDarkMode ? "#444" : "#1877F2",
                  color: "white",
                  boxShadow: isDarkMode ? "none" : "0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {t('Confirm change password')}
              </button>
            </form>
          ) : null}

          {/* Message */}
          <p className="text-xs text-center mt-2 min-h-[16px]" style={{ color: "red" }}>
            {message || "\u00A0"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;
