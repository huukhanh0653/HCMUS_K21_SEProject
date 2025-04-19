import { FcGoogle } from "react-icons/fc";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useTranslation } from "react-i18next";
import { signInWithGoogle } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
// Import UserService để gọi api
import UserService from "../../services/UserService";

const SocialLogin = ({ onError }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user) return onError("Đăng nhập Google thất bại");

      await UserService.syncFirebaseUser(user.uid, user.email);
      const response = await UserService.getUserByEmail(user.email);

      console.log("User response from backend:", response);

      // Convert string to boolean if needed
      const isBanned = response.status === "banned";

      if (isBanned) {
        console.log("User is not activated:", response);
        const auth = getAuth();
        auth.signOut(); // Đăng xuất người dùng nếu tài khoản không được kích hoạt
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("user");

        onError("User is not activated");
        throw new Error("User is not activated");
      } else {
        localStorage.setItem("email", response.email);
        localStorage.setItem("username", response.username);
        localStorage.setItem("user", JSON.stringify(response));
        return navigate("/");
      }
    } catch (err) {
      console.log("1232");
      navigate("/login");
      console.error("Google login error:", err);
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
  );
};

export default SocialLogin;
