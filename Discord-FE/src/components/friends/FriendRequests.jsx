import React from "react";

function FriendRequests({ friendRequests, onAccept, onDecline }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Danh sách lời mời kết bạn</h2>
      {friendRequests.length === 0 ? (
        <p>Không có lời mời kết bạn nào.</p>
      ) : (
        friendRequests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-2 border-b border-gray-700"
          >
            <span>{request.sender?.username}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(request._id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Đồng ý
              </button>
              <button
                onClick={() => onDecline(request._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Từ chối
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendRequests;
