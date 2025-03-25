import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/layout/ThemeProvider";

const ChooseUsernameForm = ({ onError }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      const msg = "Tên người dùng không được để trống";
      setError(msg);
      onError && onError(msg);
      return;
    }

    localStorage.setItem("username", username.trim());
    console.log("Username saved:", username);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Tên người dùng"
        className={`p-3 rounded-md border outline-none transition ${
          isDarkMode
            ? "bg-[#202225] text-white border-gray-700 focus:border-gray-400"
            : "bg-[#F8F9FA] text-black border-gray-300 focus:border-gray-500 shadow-sm"
        }`}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        className={`font-bold py-2 rounded-md transition ${
          isDarkMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-[#0D6EFD] hover:bg-[#0056D2] text-white"
        }`}
      >
        Xác nhận
      </button>
    </form>
  );
};

export default ChooseUsernameForm;
