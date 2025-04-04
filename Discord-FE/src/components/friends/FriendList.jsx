import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MoreVertical,
  MessageSquare,
  Video,
  UserMinus,
  Slash,
} from 'lucide-react';

export default function FriendList() {
  const { t } = useTranslation();
  const [friends, setFriends] = useState([]);
  const [showMenuForFriend, setShowMenuForFriend] = useState(null);

  // Hàm fetch danh sách bạn bè từ API
  const fetchFriends = async () => {
    try {
      const response = await fetch(
        'http://localhost:8081/api/friendships/67e58b59171f9075a48afe76',
        {
          headers: { accept: 'application/json' },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Chuyển đổi dữ liệu nếu cần (ví dụ thêm trạng thái mặc định)
        const transformed = data.map((friend) => ({
          ...friend,
          status: 'online', // hoặc logic khác tùy bạn
        }));
        setFriends(transformed);
      } else {
        console.error('Failed to fetch friends data');
      }
    } catch (error) {
      console.error('Error fetching friends data:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Khi ấn vào nút "Message"
  const handleMessage = (friend) => {
    console.log('Message friend:', friend);
    // Xử lý logic mở DM, chuyển tab chat, v.v.
  };

  // Xử lý các option trong menu 3 chấm
  const handleOptionClick = (friendId, action) => {
    switch (action) {
      case 'video':
        console.log(`Video call with friend: ${friendId}`);
        // Thực hiện logic video call
        break;
      case 'unfriend':
        console.log(`Unfriend friend: ${friendId}`);
        // Thực hiện logic hủy kết bạn
        break;
      case 'block':
        console.log(`Block friend: ${friendId}`);
        // Thực hiện logic chặn
        break;
      default:
        break;
    }
    // Đóng menu sau khi chọn
    setShowMenuForFriend(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{t('Friends')}</h2>
      <p className="text-sm text-gray-400 mb-4">
        {t('Your friends are listed below.')}
      </p>

      {/* Danh sách bạn bè */}
      <div className="flex flex-col gap-2">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="p-2 bg-[#1e1f22] rounded flex justify-between items-center"
          >
            {/* Thông tin bạn bè */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#36393f] rounded-full overflow-hidden">
                <img
                  src={friend.avatar || '/placeholder.svg?height=32&width=32'}
                  alt={friend.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-gray-300">{friend.username}</p>
                <p className="text-gray-500 text-sm">{friend.email}</p>
                <p
                  className={`text-sm ${
                    friend.status === 'online' ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {friend.status || 'offline'}
                </p>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex items-center gap-2 relative">
              {/* Nút Message */}
              <button
                className="relative group"
                onClick={() => handleMessage(friend)}
              >
                <MessageSquare size={20} />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t('Message')}
                </span>
              </button>

              {/* Nút 3 chấm Options */}
              <div className="relative">
                <button
                  className="relative group"
                  onClick={() =>
                    setShowMenuForFriend(
                      showMenuForFriend === friend._id ? null : friend._id
                    )
                  }
                >
                  <MoreVertical size={20} />
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {t('Options')}
                  </span>
                </button>

                {/* Menu thả xuống */}
                {showMenuForFriend === friend._id && (
                  <div className="absolute right-0 top-full mt-2 bg-[#2b2d31] border border-gray-700 rounded shadow-md z-10 w-36">
                    <button
                      onClick={() => handleOptionClick(friend._id, 'video')}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <Video size={16} className="mr-2" />
                      {t('Video Call')}
                    </button>
                    <button
                      onClick={() => handleOptionClick(friend._id, 'unfriend')}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <UserMinus size={16} className="mr-2" />
                      {t('Unfriend')}
                    </button>
                    <button
                      onClick={() => handleOptionClick(friend._id, 'block')}
                      className="flex items-center w-full px-4 py-2 hover:bg-[#3a3c41] text-left"
                    >
                      <Slash size={16} className="mr-2" />
                      {t('Block')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
