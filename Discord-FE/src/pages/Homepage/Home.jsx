import { useState, useEffect } from "react";
import {
  Plus,
  Mic,
  Headphones,
  Settings,
  MessageSquare,
  Users,
  Gamepad2,
  TreePine,
  Bell as BellIcon,
  Ghost,
  Sword,
  Crown,
  Rocket,
  Hash,
  Volume2,
  UserPlus,
} from "lucide-react";

// Friends 
import DirectMessage from "../../components/friends/DirectMessage/DirectMessage";
import FriendsView from "../../components/friends/FriendsView";
import FriendContextMenu from "../../components/friends/FriendContextMenu";
import FriendProfile from "../../components/friends/FriendProfile";
import AddFriend from "../../components/friends/AddFriend";
import FriendRequests from "../../components/friends/FriendRequests";
import FriendList from "../../components/friends/FriendList";

// Server
import ServerChannels from "../../components/server/ServerChannels";
import ServerChat from "../../components/server/ServerChat/ServerChat";
import ServerMembers from "../../components/server/ServerMembers";
import CreateServerModal from "../../components/server/CreateServerModal";
import { useTranslation } from "react-i18next";
import { useTheme } from '../../components/layout/ThemeProvider';
import UserPanel from "../../components/user/UserPanel";

import { User_API } from "../../../apiConfig";

export default function Home({ user, onProfileClick }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]); // Dữ liệu từ API
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProfileFriend, setSelectedProfileFriend] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [initialFetched, setInitialFetched] = useState(false);
  const [prevRequests, setPrevRequests] = useState([]);
  const [newRequests, setNewRequests] = useState([]);

  const defaultChannels = [
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "announcements", type: "text" },
    { id: 3, name: "General", type: "voice" },
    { id: 4, name: "Gaming", type: "voice" },
  ];

  const mockMessages = {
    Levii: [
      {
        id: 1,
        sender: "Levii",
        content: "Hey there!",
        timestamp: new Date("2025-03-22T08:09:00").getTime(),
      },
      {
        id: 2,
        sender: "You",
        content: "Hi Levii!",
        timestamp: new Date("2025-03-22T08:09:00").getTime(),
      },
    ],
    Dolphin: [
      {
        id: 1,
        sender: "Dolphin",
        content: "How's it going?",
        timestamp: new Date("2025-03-22T14:30:00").getTime(),
      },
    ],
    // Add more mock messages...
  };

  const servers = [
    { icon: TreePine, color: "#3ba55c", label: "Nature Gaming" },
    { icon: Gamepad2, color: "#5865f2", label: "Gaming Hub" },
    { icon: BellIcon, color: "#faa61a", label: "Sports Club" },
    { icon: Ghost, color: "#ed4245", label: "Ghost Gaming" },
    { icon: Sword, color: "#9b59b6", label: "RPG Community" },
    { icon: Crown, color: "#f1c40f", label: "Royal Gaming" },
    { icon: Rocket, color: "#e91e63", label: "Space Station" },
  ];

  // Lưu thông tin user vào localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_info", JSON.stringify(user));
    }
  }, [user]);
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch dữ liệu bạn bè từ API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${User_API}/api/friendships/${currentUser._id}`, {
          headers: { accept: "application/json" }
        });
        if (response.ok) {
          const data = await response.json();
          const transformed = data.map(friend => ({
            _id: friend._id,
            username: friend.username,
            email: friend.email,
            avatar: friend.avatar,
            status: "online" // Hoặc logic khác tùy yêu cầu
          }));
          setFriends(transformed);
        } else {
          console.error("Failed to fetch friends data");
        }
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };

    const fetchRequests = async () => {
      console.log("Fetching friend requests in Home...");
      if (!currentUser._id) return;

      try {
        const response = await fetch(
          `${User_API}/api/friendships/requests/${currentUser._id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (!initialFetched) {
            setInitialFetched(true);
            setPrevRequests(data);
            setPendingRequests(data);
          } else {
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

    fetchFriends();
  }, [currentUser._id, initialFetched, prevRequests]);

  // Tự động chọn channel text đầu tiên khi chọn server
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

  const selectedFriendObj = selectedFriend
    ? friends.find((f) => f.username === selectedFriend)
    : null;

  const handleFriendAction = (action, friend) => {
    switch (action) {
      case "profile":
        setSelectedProfileFriend(friend);
        setShowProfile(true);
        break;
      case "unfriend":
        console.log(`Unfriend ${friend.username}`);
        break;
      case "block":
        console.log(`Block ${friend.username}`);
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

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };


  useEffect(() => {
    const fetchRequests = async () => {
      console.log("Fetching friend requests in Home...");
      if (!currentUser._id) return;

      try {
        const response = await fetch(
          `${User_API}/api/friendships/requests/${currentUser._id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (!initialFetched) {
            setInitialFetched(true);
            setPrevRequests(data);
            setPendingRequests(data);
          } else {
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
    // fetchRequests();
    /* Lặp lại mỗi 10 phút
    const interval = setInterval(fetchRequests, 600000);
    return () => clearInterval(interval);*/
  }, [currentUser._id, initialFetched, prevRequests]);

  const handleAcceptRequest = async (requestID) => {
    try {
      await fetch(`${User_API}/api/friendships/request/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID })
      });
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestID));
      setNewRequests((prev) => prev.filter((req) => req._id !== requestID));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeclineRequest = async (requestID) => {
    try {
      await fetch(`${User_API}/api/friendships/request/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID })
      });
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestID));
      setNewRequests((prev) => prev.filter((req) => req._id !== requestID));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const handleCloseModal = () => {
    setNewRequests([]);
  };

  return (
    <div
      className={`fixed inset-0 flex h-screen w-screen overflow-hidden ${
        isDarkMode ? "bg-[#313338] text-gray-100" : "bg-[#F8F9FA] text-[#333333]"
      }`}
    >
      {/* Left sidebar - Server list */}
      <div
        className={`h-full w-[72px] flex flex-col items-center pt-3 gap-2 ${
          isDarkMode ? "bg-[#1e1f22]" : "bg-white border-r border-gray-200"
        }`}
      >
        {/* Discord DM Button */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 cursor-pointer transition-all duration-200 ease-linear ${
            isDarkMode ? "bg-[#5865f2] hover:rounded-2xl" : "bg-[#1877F2] hover:rounded-2xl"
          }`}
          onClick={() => {
            setSelectedServer(null);
            setSelectedChannel(null);
          }}
        >
          <MessageSquare className="text-white" size={24} />
        </div>
        <div
          className={`w-12 h-[2px] rounded-full mb-2 ${
            isDarkMode ? "bg-[#35363c]" : "bg-gray-300"
          }`}
        ></div>

        {/* Server icons */}
        <div className="flex flex-col gap-2 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          {servers.map((server, index) => (
            <div
              key={index}
              className={`group relative w-12 h-12 rounded-full transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer ${
                selectedServer?.label === server.label ? "rounded-2xl" : ""
              }`}
              style={{ backgroundColor: server.color }}
              onClick={() => handleServerClick(server)}
            >
              <server.icon className="text-white" size={24} />
              <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200 -translate-x-2"></div>
              <div
                className={`absolute left-full ml-4 px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${
                  isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
                }`}
              >
                {server.label}
              </div>
            </div>
          ))}
        </div>

        <div className={`w-12 h-[2px] rounded-full my-2 ${isDarkMode ? "bg-[#35363c]" : "bg-gray-300"}`}></div>
        
        {/* Add Server button */}
        <div
          className={`w-12 h-12 rounded-full transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer group mb-2 ${
            isDarkMode
              ? "bg-[#36393f] hover:bg-[#3ba55d]"
              : "bg-[#54565BFF] hover:bg-gray-300 border border-gray-300"
          }`}
          onClick={() => setShowCreateServer(true)}
        >
          <Plus
            className={`transition-colors ${
              isDarkMode 
                ? "text-[#3ba55d] group-hover:text-white" 
                : "text-[#1877F2] group-hover:text-black"
            }`}
            size={24}
          />
        </div>
      </div>

      {/* Channel/DM sidebar */}
      {selectedServer ? (
        //Channel sidebar 
        <div
          className={`h-full w-60 flex flex-col ${
            isDarkMode ? "bg-[#2b2d31]" : "bg-white border-r border-gray-200"
          }`}
        >
          <ServerChannels
            server={selectedServer}
            onChannelSelect={handleChannelSelect}
            onProfileClick={onProfileClick}
            selectedChannelId={selectedChannel?.id}
          />
          <UserPanel user={user} onProfileClick={onProfileClick} />
        </div>
      ) : (
        //DM sidebar
        <div
          className={`h-full w-60 flex flex-col ${
            isDarkMode ? "bg-[#2b2d31]" : "bg-white border-r border-gray-200"
          }`}
        >
          <div className="p-3">
            <div
              className={`rounded-md flex items-center px-2 ${
                isDarkMode ? "bg-[#1e1f22]" : "bg-white border border-gray-300 shadow-sm"
              }`}
            >
              <input
                type="text"
                placeholder={t("Find or start a conversation")}
                className={`w-full text-sm py-1 focus:outline-none bg-transparent border-none ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
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
                      : "bg-[#1877F2] text-white"
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
                {t("Friends")}
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "online"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-[#1877F2] text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("online");
                  setShowAddFriend(false);
                }}
              >
                {t("Online")}
              </button>

              <button
                className={`w-full px-2 py-1 rounded text-left ${
                  activeTab === "friend_requests"
                    ? isDarkMode
                      ? "bg-[#5865f2] text-white"
                      : "bg-[#1877F2] text-white"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-[#35373c]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveTab("friend_requests");
                  setShowAddFriend(false);
                }}
              >
                {t("Friend requests")}
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
                      : "bg-green-500 text-white"
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

          <div
            className={`px-2 text-xs font-semibold flex items-center justify-between ${
              isDarkMode ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <span>{t("Direct Messages")}</span>
            <Plus size={16} className="cursor-pointer" />
          </div>

          {/* Friends list */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 py-1">
              {friends.map((friend, index) => (
                <FriendContextMenu key={index} friend={friend} onAction={handleFriendAction}>
                  <div
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer ${
                      selectedFriend === friend.username
                        ? isDarkMode
                          ? "bg-[#35373c]"
                          : "bg-gray-200"
                        : isDarkMode
                        ? "hover:bg-[#35373c]"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedFriend(friend.username);
                      setShowAddFriend(false);
                      setActiveTab("friend");
                    }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-[#36393f]">
                        <img
                          src={friend.avatar || "/placeholder.svg"}
                          alt={friend.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                          isDarkMode ? "border-[#2b2d31]" : "border-white"
                        } ${getStatusColor(friend.status)}`}
                      ></div>
                    </div>
                    <span>{friend.username}</span>
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
      <div
        className={`flex-1 h-full flex flex-col ${
          isDarkMode ? "bg-[#313338]" : "bg-[#F8F9FA]"
        }`}
      >
        {/* Header */}
        <div
          className={`h-12 min-h-[3rem] flex-shrink-0 border-b flex items-center px-4 cursor-pointer ${
            isDarkMode ? "border-[#232428]" : "border-gray-300"
          }`}
          onClick={() => {
            if (selectedFriendObj) {
              onProfileClick(selectedFriendObj);
            } else if (selectedServer && selectedChannel) {
              console.log("Channel selected:", selectedChannel.name);
            }
          }}
        >
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
              <div className="w-8 h-8 rounded-full mr-2 overflow-hidden bg-[#36393f]">
                <img
                  src={selectedFriendObj.avatar || "/placeholder.svg"}
                  alt={selectedFriendObj.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold">{selectedFriendObj.username}</span>
            </>
          ) : (
            <>
              <Users size={20} className="text-gray-400 mr-2" />
              <span className="font-semibold">{t("Friend")}</span>
            </>
          )}
        </div>
        {/* Main content */}
        {selectedServer && selectedChannel ? (
          <div className="flex flex-1">
            <ServerChat channel={selectedChannel} />
            <ServerMembers />
          </div>
        ) : activeTab === "friends" ? (
          <FriendList />
        ) : activeTab === "addfriend" ? (
          <AddFriend />
        ) : activeTab === "friend_requests" ? (
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

      {/* Modal hiển thị lời mời kết bạn */}
      {newRequests.length > 0 && activeTab !== "friend_requests" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black rounded p-6 w-[300px] text-center relative">
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
    </div>
  );
}
