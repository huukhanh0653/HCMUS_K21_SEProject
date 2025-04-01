import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    try {
      setErrorMessage(""); // Reset lỗi trước mỗi lần tìm kiếm

      const response = await fetch(`http://localhost:8081/users/email/${email}`);
      
      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // Giả sử data trả về là một mảng người dùng
        setSearchResult(data[0]); // Hiển thị người dùng đầu tiên (bạn có thể sửa lại nếu muốn hiển thị nhiều)
      } else {
        setSearchResult(null);
        setErrorMessage("No users found with this email.");
      }
    } catch (error) {
      setSearchResult(null);
      setErrorMessage("Error fetching user: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{t('Add Friend')}</h2>
      <p className="text-sm text-gray-400 mb-4">
        {t('You can find new friends to make with their email')}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("Enter email")}
          className="flex-1 p-2 bg-[#2b2d31] text-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-[#5865f2] text-white rounded hover:bg-[#4752c4] inline-block"
        >
          {t("Find Friend")}
        </button>
      </div>
      
      {/* Hiển thị lỗi nếu có */}
      {errorMessage && (
        <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
      )}

      {/* Hiển thị kết quả tìm kiếm */}
      {searchResult && (
        <div className="mt-4 p-2 bg-[#1e1f22] rounded">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#36393f] rounded-full">
              <img
                src={searchResult.avatar || "/placeholder.svg?height=32&width=32"}
                alt={searchResult.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-300">{searchResult.name}</p>
              <p className="text-gray-500 text-sm">{searchResult.email}</p>
              <p className={`text-sm ${searchResult.status === "online" ? "text-green-500" : "text-gray-500"}`}>
                {searchResult.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
