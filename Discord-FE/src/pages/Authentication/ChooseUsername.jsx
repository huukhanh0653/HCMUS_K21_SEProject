import { useTheme } from "../../components/layout/ThemeProvider";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/echochat_logo.svg";
import DarkBackground from "../../assets/darkmode_background.jpg";
import LightBackground from "../../assets/whitemode_background.jpg";
import ChooseUsernameForm from "../../components/auth/ChooseUsernameForm";

const ChooseUsername = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

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
        className={`w-[500px] p-8 rounded-lg shadow-lg transition-colors ${
          isDarkMode
            ? "bg-[#2F3136] text-white"
            : "bg-white text-black border border-gray-300"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Chọn tên người dùng</h2>
        <p className={`text-center mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Đây sẽ là tên bạn hiển thị trong các cuộc trò chuyện.
        </p>

        <ChooseUsernameForm />
      </div>
    </div>
  );
};

export default ChooseUsername;
