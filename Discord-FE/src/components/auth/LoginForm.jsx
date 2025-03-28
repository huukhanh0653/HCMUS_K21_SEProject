import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useTranslation } from "react-i18next";
import { signInWithEmail } from "../../firebase";
import { updateUsedUserList } from './updateUsedUserList';

const LoginForm = ({ onSuccess, onError }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onError("Email không hợp lệ");
      return;
    }
    if (!password) {
      onError("Mật khẩu không được để trống");
      return;
    }

    try {
      const user = await signInWithEmail(email, password);
      //console.log("User: ", user);
      
      await fetch("http://localhost:5001/users/sync-firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      const res = await fetch(`http://localhost:5001/users/email/${email}`);
      const response = await res.json(); // Giải mã JSON trả về từ server
      localStorage.setItem("email", response.email);
      localStorage.setItem("username", response.username);
      localStorage.setItem("user", JSON.stringify(response));

      updateUsedUserList(user, response.username);
      onSuccess();
    } catch (err) {
      onError("Đăng nhập thất bại: " + err.message);
    }
  };

  return (
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
      <button
        type="submit"
        className={`font-bold py-2 rounded-md transition ${
          isDarkMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-[#1877F2] hover:bg-[#0D6EFD] text-white"
        }`}
      >
        {t("Login")}
      </button>
    </form>
  );
};

export default LoginForm;
