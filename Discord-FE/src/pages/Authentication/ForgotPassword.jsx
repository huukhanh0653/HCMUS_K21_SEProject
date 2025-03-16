import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../../components/ThemeProvider";
import Logo from "../../assets/echochat_logo.svg";

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(9).fill(""));
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("email");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

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
          Quên mật khẩu
        </h1>
      </div>

      <div className="flex w-[800px] bg-[#2F3136] p-6 rounded-lg shadow-lg text-white mx-auto">
        <div className="w-1/3 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          <h2 className="text-xl font-bold text-center mb-4">Reset lại mật khẩu</h2>
          <p className="text-gray-400 text-center">
            Làm theo các bước sau để reset lại tài khoản của bạn.
          </p>
        </div>

        <div className="w-2/3 p-6">
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Nhập email"
                className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-md transition"
              >
                Xác nhận
              </button>
            </form>
          ) : step === "code" ? (
            <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-9 gap-2 mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e, index)}
                    className="w-12 h-12 text-center text-black text-xl font-semibold border border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 transition"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-md transition w-full"
              >
                Xác nhận mã
              </button>
            </form>
          ) : step === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Enter new password"
                className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-gray-400 outline-none transition"
              />
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-md transition"
              >
                Xác nhận thay đổi mật khẩu
              </button>
            </form>
          ) : null}

          <p className="text-red-500 text-xs text-center mt-2 min-h-[16px]">{message || "\u00A0"}</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
