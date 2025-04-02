import { useState, useEffect } from "react"
import {
  Plus,
  Mic,
  Headphones,
  Settings,
  MessageSquare,
  Users,
  Gamepad2,
  TreePine,
  Bell as BellIcon, // Đã sửa BellIcon
  Ghost,
  Sword,
  Crown,
  Rocket,
  Hash, 
  Volume2, // Thêm nếu cần
  UserPlus,
} from "lucide-react"

// Friends 
import DirectMessage from "../../components/friends/DirectMessage/DirectMessage"
import FriendsView from "../../components/friends/FriendsView"
import FriendContextMenu from "../../components/friends/FriendContextMenu"
import FriendProfile from "../../components/friends/FriendProfile"
import AddFriend from "../../components/friends/AddFriend"
import FriendRequests from "../../components/friends/FriendRequests"

// Server
import ServerChannels from "../../components/server/ServerChannels"
import ServerChat from "../../components/server/ServerChat/ServerChat"
import ServerMembers from "../../components/server/ServerMembers"
import CreateServerModal from "../../components/server/CreateServerModal"
import { useTranslation } from "react-i18next";
import { useTheme } from '../../components/layout/ThemeProvider';
import UserPanel from "../../components/user/UserPanel"

export default function Home({user, onProfileClick }) {
  // Dark mode & Light mode toggle
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProfileFriend, setSelectedProfileFriend] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  // Quản lý hiển thị màn hình Add Friend
  const [showAddFriend, setShowAddFriend] = useState(false);
  // Danh sách yêu cầu kết bạn (dùng cho 2 mục: modal thông báo & FriendRequests component)
  const [pendingRequests, setPendingRequests] = useState([]);
  // Để so sánh dữ liệu fetch
  const [initialFetched, setInitialFetched] = useState(false);
  const [prevRequests, setPrevRequests] = useState([]);
  // Chứa danh sách yêu cầu mới (khác với lần fetch trước)
  const [newRequests, setNewRequests] = useState([]);

  // Default channels for servers
  const defaultChannels = [
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "announcements", type: "text" },
    { id: 3, name: "General", type: "voice" },
    { id: 4, name: "Gaming", type: "voice" },
  ];

  // Mock messages data
  const mockMessages = {
    Levii: [
      {
        id: 1,
        sender: "Levii",
        content: "Hey there!",
        timestamp: new Date("2025-03-22T08:09:00").getTime()
      },
      {
        id: 2,
        sender: "You",
        content: "Hi Levii!",
        timestamp: new Date("2025-03-22T08:09:00").getTime()
      }
    ],
    Dolphin: [
      {
        id: 1,
        sender: "Dolphin",
        content: "How's it going?",
        timestamp: new Date("2025-03-22T14:30:00").getTime()
      }
    ]    
    // Add more mock messages...
  };

  // Friends data with status
  const friends = [
    { name: "Levii", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Dolphin", status: "idle", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Cutehome", status: "dnd", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Ngoc Tran", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "trstvxmnh", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "s...", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "DraNox", status: "idle", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "MEE6", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
  ];

  // Server list data
  const servers = [
    { icon: TreePine, color: "#3ba55c", label: "Nature Gaming" },
    { icon: Gamepad2, color: "#5865f2", label: "Gaming Hub" },
    { icon: BellIcon, color: "#faa61a", label: "Sports Club" },
    { icon: Ghost, color: "#ed4245", label: "Ghost Gaming" },
    { icon: Sword, color: "#9b59b6", label: "RPG Community" },
    { icon: Crown, color: "#f1c40f", label: "Royal Gaming" },
    { icon: Rocket, color: "#e91e63", label: "Space Station" },
  ];

  // Save user info to local
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_info", JSON.stringify(user));
    }
  }, [user]);

  // Auto-select the first channel when a server is selected
  useEffect(() => {
    if (selectedServer && !selectedChannel) {
      const firstTextChannel = defaultChannels.find((channel) => channel.type === "text");
      if (firstTextChannel) {
        setSelectedChannel(firstTextChannel);
      }
    }
  }, [selectedServer, selectedChannel]);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Lấy friend object từ selectedFriend
  const selectedFriendObj = selectedFriend
    ? friends.find((f) => f.name === selectedFriend)
    : null;

  const handleFriendAction = (action, friend) => {
    switch (action) {
      case "profile":
        setSelectedProfileFriend(friend);
        setShowProfile(true);
        break;
      case "unfriend":
        console.log(`Unfriend ${friend.name}`);
        break;
      case "block":
        console.log(`Block ${friend.name}`);
        break;
    }
  };

  const handleServerClick = (server) => {
    setSelectedServer(server);
    setSelectedFriend(null); 
    const firstTextChannel = defaultChannels.find((channel) => channel.type === "text");
    if (firstTextChannel) {
      setSelectedChannel(firstTextChannel);
    }
  };

  // Handle channel selection
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  // ============================
  // ======= FRIEND REQUESTS ==
  // ============================
  const currentUserFromStorage = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("Fetching friend requests in Home...");
      if (!currentUserFromStorage._id) return; // Nếu chưa có userID thì thoát

      try {
        const response = await fetch(
          `http://localhost:8081/api/friendships/requests/${currentUserFromStorage._id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (!initialFetched) {
            // Lần fetch đầu tiên
            setInitialFetched(true);
            setPrevRequests(data);
            setPendingRequests(data);
          } else {
            // So sánh dữ liệu mới với dữ liệu đã có
            const diff = data.filter(
              (req) => !prevRequests.some((prev) => prev._id === req._id)
            );
            if (diff.length > 0) {
              setNewRequests(diff);
            }
            setPendingRequests(data);
            setPrevRequests(data);
          }
        } else {
          setPendingRequests([]);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    // Gọi ngay khi component mount
    fetchRequests();

    // Lặp lại mỗi 5 giây
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [currentUserFromStorage._id, initialFetched, prevRequests]);

  // Xử lý Đồng ý kết bạn
  const handleAcceptRequest = async (requestID) => {
    try {
      await fetch("http://localhost:8081/api/friendships/request/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestID })
      });
      // Xóa request đó khỏi pendingRequests và newRequests nếu có
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestID));
      setNewRequests((prev) => prev.filter((req) => req._id !== requestID));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Xử lý Từ chối kết bạn
  const handleDeclineRequest = async (requestID) => {
    try {
      await fetch("http://localhost:8081/api/friendships/request/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestID })
      });
      // Xóa request khỏi pendingRequests và newRequests nếu có
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestID));
      setNewRequests((prev) => prev.filter((req) => req._id !== requestID));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  // Xử lý đóng modal hiển thị lời mời kết bạn
  const handleCloseModal = () => {
    setNewRequests([]);
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-[#313338] text-gray-100">
      {/* Left sidebar - Server list */}
      <div className="h-full w-[72px] bg-[#1e1f22] flex flex-col items-center pt-3 gap-2">
        {/* Discord DM Button */}
        <div
          className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center mb-2 cursor-pointer hover:rounded-2xl transition-all duration-200 ease-linear"
          onClick={() => {
            setSelectedServer(null);
            setSelectedChannel(null);
          }}
        >
          <MessageSquare className="text-white" size={24} />
        </div>
        <div className="w-12 h-[2px] bg-[#35363c] rounded-full mb-2"></div>

        {/* Server icons */}
        <div className="flex flex-col gap-2 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          {servers.map((server, index) => (
            <div
              key={index}
              className={`group relative w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer ${
                selectedServer?.label === server.label ? "rounded-2xl" : ""
              }`}
              style={{ backgroundColor: server.color }}
              onClick={() => handleServerClick(server)}
            >
              <server.icon className="text-white" size={24} />
              <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200 -translate-x-2"></div>
              <div className="absolute left-full ml-4 px-3 py-2 bg-black rounded-md text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {server.label}
              </div>
            </div>
          ))}
        </div>

        <div className="w-12 h-[2px] bg-[#35363c] rounded-full my-2"></div>
        <div
          className="w-12 h-12 bg-[#36393f] hover:bg-[#3ba55d] rounded-full hover:rounded-2xl transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer group mb-2"
          onClick={() => setShowCreateServer(true)}
        >
          <Plus className="text-[#3ba55d] group-hover:text-white transition-colors" size={24} />
        </div>
      </div>

      {/* Channel/DM sidebar */}
      {selectedServer ? (
        <div className="h-full w-60 bg-[#2b2d31] flex flex-col">
          <ServerChannels
            server={selectedServer}
            onChannelSelect={handleChannelSelect}
            onProfileClick={onProfileClick}
            selectedChannelId={selectedChannel?.id}
          />
          {/* User panel */}
          <UserPanel user={user} onProfileClick={onProfileClick} />
        </div>      
      ) : (
        <div className="h-full w-60 bg-[#2b2d31] flex flex-col">
          <div className="p-3">
            <div className="bg-[#1e1f22] rounded-md flex items-center px-2">
              <input
                type="text"
                placeholder={t('Find or start a conversation')}
                className="bg-transparent border-none text-sm py-1 w-full focus:outline-none text-gray-300"
              />
            </div>
          </div>

          <div className="px-2 mb-2">
            <div className="flex flex-col items-start gap-2 mb-2">
              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "friends"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("friends");
                  setSelectedFriend(null);
                  setShowAddFriend(false);
                }}
              >
                {t('Friends')}
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "online"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("online");
                  setShowAddFriend(false);
                }}
              >
                {t('Online')}
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "all"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("all");
                  setShowAddFriend(false);
                }}
              >
                {t('Friend requests')}
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-red-500 rounded-full px-2 py-0.5 text-xs">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left flex items-center gap-2 ${
                  activeTab === "addfriend"
                    ? isDarkMode 
                      ? "bg-green-600 text-white" 
                      : "bg-green-500 text-black"
                    : isDarkMode 
                      ? "text-gray-400 hover:bg-[#35373c]"
                      : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("addfriend");
                  setShowAddFriend(true);
                  setSelectedFriend(null);
                }}
              >
                <UserPlus size={16} /> {t("Add friend")}
              </button>
            </div>
          </div>

          <div className="px-2 text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>{t('Direct Messages')}</span>
            <Plus size={16} className="cursor-pointer" />
          </div>

          {/* Friends list */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 py-1">
              {friends.map((friend, index) => (
                <FriendContextMenu key={index} friend={friend} onAction={handleFriendAction}>
                  <div
                    className={`flex items-center gap-2 p-1 rounded hover:bg-[#35373c] cursor-pointer ${
                      selectedFriend === friend.name ? "bg-[#35373c]" : ""
                    }`}
                    onClick={() => {
                      setSelectedFriend(friend.name);
                      setShowAddFriend(false);
                    }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-[#36393f] rounded-full flex-shrink-0 overflow-hidden">
                        <img
                          src={friend.avatar || "/placeholder.svg"}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${getStatusColor(friend.status)}`}
                      ></div>
                    </div>
                    <span className="text-gray-300">{friend.name}</span>
                  </div>
                </FriendContextMenu>
              ))}
            </div>
          </div>

          {/* User panel */}
          <UserPanel user={user} onProfileClick={onProfileClick} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 h-full flex flex-col bg-[#313338]">
        {/* Header */}
        <div className="h-12 min-h-[3rem] flex-shrink-0 border-b border-[#232428] flex items-center px-4">
          {selectedServer && selectedChannel ? (
            <>
              {selectedChannel.type === "text" ? (
                <Hash size={20} className="text-gray-400 mr-2" />
              ) : (
                <Volume2 size={20} className="text-gray-400 mr-2" />
              )}
              <span className="font-semibold">{selectedChannel.name}</span>
            </>
          ) : selectedFriendObj ? (
            <>
              <div className="w-8 h-8 bg-[#36393f] rounded-full mr-2 overflow-hidden">
                <img
                  src={selectedFriendObj.avatar || "/placeholder.svg"}
                  alt={selectedFriendObj.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="font-semibold">{selectedFriendObj.name}</span>
            </>
          ) : (
            <>
              <Users size={20} className="text-gray-400 mr-2" />
              <span className="font-semibold">{t('Friend')}</span>
            </>
          )}
        </div>

        {/* Main content */}
        {selectedServer && selectedChannel ? (
          <div className="flex flex-1">
            <ServerChat channel={selectedChannel} />
            <ServerMembers />
          </div>
        ) : activeTab === "addfriend" ? (
          <AddFriend />
        ) : activeTab === "all" ? (
          <FriendRequests
            friendRequests={pendingRequests}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
          />
        ) : selectedFriendObj ? (
          <DirectMessage friend={selectedFriendObj} messages={mockMessages[selectedFriend] || []} />
        ) : (
          <FriendsView />
        )}
      </div>

      {/* Friend profile modal */}
      {showProfile && selectedProfileFriend && (
        <FriendProfile
          friend={selectedProfileFriend}
          onClose={() => {
            setShowProfile(false);
            setSelectedProfileFriend(null);
          }}
        />
      )}

      {/* Create server modal */}
      {showCreateServer && <CreateServerModal onClose={() => setShowCreateServer(false)} />}

      {/* ============= MODAL hiển thị lời mời kết bạn (chỉ hiển thị nếu có yêu cầu mới) ============= */}
      {newRequests.length > 0 && activeTab !== "all" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black rounded p-6 w-[300px] text-center relative">
            {/* Nút tắt modal */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-2">
              {newRequests[0].sender?.username} muốn kết bạn với bạn
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleAcceptRequest(newRequests[0]._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Đồng ý
              </button>
              <button
                onClick={() => handleDeclineRequest(newRequests[0]._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============= End Modal ============= */}
    </div>
  );
}