import { FcGoogle } from "react-icons/fc";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useTranslation } from "react-i18next";
import { signInWithGoogle } from "../../firebase";
import { useNavigate } from "react-router-dom";

const SocialLogin = ({ onError }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user) return onError("Đăng nhập Google thất bại");

      await fetch("http://localhost:5001/users/sync-firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      localStorage.setItem("email", user.email);
      navigate("/choose-username");
    } catch (err) {
      onError("Google login failed: " + err.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className={`flex items-center justify-center gap-3 w-full py-2 rounded-md font-semibold shadow-md transition mt-3 ${
        isDarkMode
          ? "bg-white text-gray-800 hover:bg-gray-300"
          : "border border-red-500 text-black bg-white hover:bg-gray-100"
      }`}
    >
      <FcGoogle className="text-2xl" />
      {t("Google Login")}
    </button>
  );s
};

export default SocialLogin;
