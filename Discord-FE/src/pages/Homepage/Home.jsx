import React, { useState, useEffect, lazy, Suspense } from "react";
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
import { useTranslation } from "react-i18next";
import { useTheme } from '../../components/layout/ThemeProvider';
import UserPanel from "../../components/user/UserPanel";
import { User_API } from "../../../apiConfig";

// Friends 
const DirectMessage = lazy(() => import("../../components/friends/DirectMessage/DirectMessage"));
const FriendsView = lazy(() => import("../../components/friends/FriendsView"));
const FriendContextMenu = lazy(() => import("../../components/friends/FriendContextMenu"));
const FriendProfile = lazy(() => import("../../components/friends/FriendProfile"));
const AddFriend = lazy(() => import("../../components/friends/AddFriend"));
const FriendRequests = lazy(() => import("../../components/friends/FriendRequests"));
const FriendList = lazy(() => import("../../components/friends/FriendList"));
const FriendRequestModal = lazy(() => import("../../components/friends/FriendRequestModal"));
const DMSidebar = lazy(() => import("../../components/friends/DMSidebar"));

// Server
const ServerList = lazy(() => import("../../components/server/ServerChat/ServerList"));
const  ServerChannels = lazy(() => import("../../components/server/ServerChannels"));
const  ServerChat = lazy(() => import("../../components/server/ServerChat/ServerChat"));
const  ServerMembers = lazy(() => import("../../components/server/ServerMembers"));
const  CreateServerModal = lazy(() => import("../../components/server/CreateServerModal"));

export default function Home({ user, onProfileClick }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  // Các state quản lý nội bộ
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProfileFriend, setSelectedProfileFriend] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
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
    // Add thêm các tin nhắn mẫu nếu cần
  };

  // Lưu thông tin user vào localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_info", JSON.stringify(user));
    }
  }, [user]);
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch dữ liệu bạn bè và yêu cầu kết bạn khi component mount
  useEffect(() => {
    if (!currentUser._id) return;

    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${User_API}/api/friendships/${currentUser._id}`,
          { headers: { accept: "application/json" } }
        );
        if (response.ok) {
          const data = await response.json();
          const transformed = data.map((friend) => ({
            _id: friend._id,
            username: friend.username,
            email: friend.email,
            avatar: friend.avatar,
            status: "online", // hoặc logic khác tùy yêu cầu
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
      try {
        const response = await fetch(
          `${User_API}/api/friendships/requests/${currentUser._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setPrevRequests(data);
          setPendingRequests(data);
        } else {
          setPendingRequests([]);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriends();
    fetchRequests();
  }, [currentUser._id]);

  // Tự động chọn channel text đầu tiên khi chọn server
  useEffect(() => {
    if (selectedServer && !selectedChannel) {
      const firstTextChannel = defaultChannels.find(
        (channel) => channel.type === "text"
      );
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
      default:
        break;
    }
  };

  const handleServerClick = (server) => {
    setSelectedServer(server);
    setActiveTab("server");
    setSelectedFriend(null);
    const firstTextChannel = defaultChannels.find(
      (channel) => channel.type === "text"
    );
    if (firstTextChannel) {
      setSelectedChannel(firstTextChannel);
    }
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleAcceptRequest = async (requestID) => {
    try {
      await fetch(`${User_API}/api/friendships/request/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID }),
      });
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== requestID)
      );
      setNewRequests((prev) =>
        prev.filter((req) => req._id !== requestID)
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeclineRequest = async (requestID) => {
    try {
      await fetch(`${User_API}/api/friendships/request/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID }),
      });
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== requestID)
      );
      setNewRequests((prev) =>
        prev.filter((req) => req._id !== requestID)
      );
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
        isDarkMode
          ? "bg-[#313338] text-gray-100"
          : "bg-[#F8F9FA] text-[#333333]"
      }`}
    >
      {/* Left sidebar - Server list */}
      <Suspense fallback={<div>Loading Server List...</div>}>
        <ServerList
          selectedServer={selectedServer}
          onServerClick={handleServerClick}
          onShowCreateServer={() => setShowCreateServer(true)}
        />
      </Suspense>

      {/* Channel/DM sidebar */}
      {selectedServer ? (
        // Channel sidebar
        <div
          className={`h-full w-60 flex flex-col ${
            isDarkMode ? "bg-[#2b2d31]" : "bg-white border-r border-gray-200"
          }`}
        >
          <Suspense fallback={<div>Loading Channels...</div>}>
            <ServerChannels
              server={selectedServer}
              onChannelSelect={handleChannelSelect}
              onProfileClick={onProfileClick}
              selectedChannelId={selectedChannel?.id}
            />
          </Suspense>
          <UserPanel user={user} onProfileClick={onProfileClick} />
        </div>
      ) : (
        // DM sidebar
        <Suspense fallback={<div>Loading DM Sidebar...</div>}>
          <DMSidebar
            isDarkMode={isDarkMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowAddFriend={setShowAddFriend}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            friends={friends}
            handleFriendAction={handleFriendAction}
            getStatusColor={getStatusColor}
            onProfileClick={onProfileClick}
            user={user}
          />
        </Suspense>
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
        <Suspense fallback={<div>Loading Main Content...</div>}>
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
          ) : activeTab === "friend" && selectedFriendObj ? (
            <DirectMessage
              friend={selectedFriendObj}
              messages={mockMessages[selectedFriend] || []}
            />
          ) : (
            <FriendsView />
          )}
        </Suspense>
      </div>

      {/* Friend profile modal */}
      <Suspense fallback={<div>Loading Friend Profile...</div>}>
        {showProfile && selectedProfileFriend && (
          <FriendProfile
            friend={selectedProfileFriend}
            onClose={() => {
              setShowProfile(false);
              setSelectedProfileFriend(null);
            }}
          />
        )}
      </Suspense>

      {/* Create server modal */}
      <Suspense fallback={<div>Loading Create Server Modal...</div>}>
        {showCreateServer && (
          <CreateServerModal onClose={() => setShowCreateServer(false)} />
        )}
      </Suspense>

      {/* Friend request modal */}
      <Suspense fallback={<div>Loading Friend Request Modal...</div>}>
        {newRequests.length > 0 && activeTab !== "friend_requests" && (
          <FriendRequestModal
            requests={newRequests}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onClose={() => setNewRequests([])}
          />
        )}
      </Suspense>
    </div>
  );
}