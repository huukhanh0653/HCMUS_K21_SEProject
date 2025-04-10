import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../components/layout/ThemeProvider";
import { signUpWithEmail } from "../../firebase";
import { useTranslation } from "react-i18next";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Import UserService để gọi api
import UserService from "../../service/UserService";

const SignupForm = ({ onError, onSuccess }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]+$/.test(phone);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) return onError("Email không hợp lệ");
    if (!username) return onError("Username không được để trống");
    if (!phone || !validatePhone(phone)) return onError("Số điện thoại không hợp lệ");
    if (!password) return onError("Mật khẩu không được để trống");
    if (password !== confirmPassword) return onError("Mật khẩu xác nhận không khớp");

    try {
      const user = await signUpWithEmail(email, password);
      if (!user) throw new Error("User creation failed, no user data returned.");

      await UserService.createUser({
        uid: user.uid,
        email: user.email,
        username,
        password,
        phone,
      });

      await signOut(getAuth());
      setTimeout(() => navigate("/login"), 2000);
      onSuccess("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
    } catch (err) {
      onError(err.message || "Đăng ký thất bại!");
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder={t("Username")}
        className={`p-3 rounded-md border ${
          isDarkMode
            ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
            : "bg-white text-black border-gray-300 focus:border-gray-500"
        }`}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className={`p-3 rounded-md border ${
          isDarkMode
            ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
            : "bg-white text-black border-gray-300 focus:border-gray-500"
        }`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="tel"
        placeholder={t("Phone number")}
        className={`p-3 rounded-md border ${
          isDarkMode
            ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
            : "bg-white text-black border-gray-300 focus:border-gray-500"
        }`}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("Password")}
          className={`p-3 w-full rounded-md border ${
            isDarkMode ? "bg-[#202225] text-white border-gray-700" : "bg-white text-black border-gray-300"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("Confirm Password")}
          className={`p-3 w-full rounded-md border ${
            isDarkMode ? "bg-[#202225] text-white border-gray-700" : "bg-white text-black border-gray-300"
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

      <button
        type="submit"
        className={`font-bold py-2 rounded-md ${
          isDarkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-[#0D6EFD] hover:bg-[#0056D2] text-white"
        }`}
      >
        {t("Signup")}
      </button>
    </form>
  );
};

export default SignupForm;
