import React from "react";

const FriendRequestModal = ({ requests, onAccept, onDecline, onClose }) => {
  if (!requests || requests.length === 0) return null;
  const currentRequest = requests[0];
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black rounded p-6 w-[300px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        <h3 className="text-lg font-semibold mb-2">
          {currentRequest.sender?.username} muốn kết bạn với bạn
        </h3>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => onAccept(currentRequest._id)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Đồng ý
          </button>
          <button
            onClick={() => onDecline(currentRequest._id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestModal;
