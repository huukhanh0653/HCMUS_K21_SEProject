import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseUsername = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Tên người dùng không được để trống");
      return;
    }

    localStorage.setItem("username", username.trim());
    console.log("Username saved:", username);
    navigate("/"); // Chuyển về trang chủ sau khi nhập username
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Chọn tên người dùng</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tên người dùng"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChooseUsername;
