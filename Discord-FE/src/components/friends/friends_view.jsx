import { X } from "lucide-react";

export default function FriendsView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      {/* Vòng tròn chứa icon X */}
      <div className="w-40 h-40 mb-4 flex items-center justify-center bg-white rounded-full shadow-lg">
        <X size={100} className="text-red-500" />
      </div>

      <p className="text-gray-400 mt-4">Không có bạn bè nào trực tuyến vào lúc này. Hãy quay lại sau!</p>

      <div className="mt-8 text-gray-300">
        <h2 className="text-xl font-bold mb-2">Đang Hoạt Động</h2>
        <p className="text-gray-400 max-w-md">
          Hiện tại không có cập nhật mới nào cả... Nếu bạn bè của bạn có hoạt động mới, ví dụ như chơi game hoặc trò
          chuyện thoại, chúng tôi sẽ hiển thị hoạt động đó ở đây!
        </p>
      </div>
    </div>
  );
}
