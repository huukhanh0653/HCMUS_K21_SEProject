// Home.jsx
import React, { useEffect, lazy, Suspense } from "react";
import {
  Plus,
  Hash,
  Volume2,
  Users,
  UserPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { User_API } from "../../../apiConfig";

// Import các action từ homeSlice
import {
  setActiveTab,
  setSelectedFriend,
  setFriends,
  setShowProfile,
  setSelectedProfileFriend,
  setSelectedServer,
  setSelectedChannel,
  setShowCreateServer,
  setShowAddFriend,
  setPendingRequests,
  setPrevRequests,
  setNewRequests,
} from "../../redux/homeSlice";

// Import UserService để gọi api
import UserService from "../../service/UserService";

// Friends - Lazy load các component liên quan
const DirectMessage = lazy(() =>
  import("../../components/friends/DirectMessage/DirectMessage")
);
const FriendsView = lazy(() =>
  import("../../components/friends/FriendsView")
);
const FriendContextMenu = lazy(() =>
  import("../../components/friends/FriendContextMenu")
);
const FriendProfile = lazy(() =>
  import("../../components/friends/FriendProfile")
);
const AddFriend = lazy(() => import("../../components/friends/AddFriend"));
const FriendRequests = lazy(() =>
  import("../../components/friends/FriendRequests")
);
const FriendList = lazy(() => import("../../components/friends/FriendList"));
const FriendRequestModal = lazy(() =>
  import("../../components/friends/FriendRequestModal")
);
const DMSidebar = lazy(() =>
  import("../../components/friends/DMSidebar")
);

// Server - Lazy load các component liên quan
const ServerList = lazy(() =>
  import("../../components/server/ServerList")
);
const ServerChannels = lazy(() =>
  import("../../components/server/ServerChannels")
);
const ServerChat = lazy(() =>
  import("../../components/server/ServerChat/ServerChat")
);
const VoiceChat = lazy(() =>
  import("../../components/server/VoiceChat/VoiceChat")
);
const ServerMembers = lazy(() =>
  import("../../components/server/ServerMembers")
);
const CreateServerModal = lazy(() =>
  import("../../components/server/CreateServerModal")
);

// Component không lazy
import UserPanel from "../../components/user/UserPanel";

export default function Home({ user, onProfileClick }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khai báo navigate

  // Lấy các state từ Redux (được khai báo trong homeSlice.js)
  const {
    activeTab,
    selectedFriend,
    friends,
    showProfile,
    selectedProfileFriend,
    selectedServer,
    selectedChannel,
    showCreateServer,
    showAddFriend,
    pendingRequests,
    newRequests,
  } = useSelector((state) => state.home);

  // Cấu hình mặc định cho channels (dành cho Server)
  const defaultChannels = [
    { id: 1, name: "generals", type: "text" },
    { id: 2, name: "announcements", type: "public" },
    { id: 3, name: "General", type: "text" },
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
    // Thêm các tin nhắn mẫu nếu cần
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
        const data = await UserService.getFriends(currentUser._id);
        const transformed = data.map((friend) => ({
          _id: friend._id,
          username: friend.username,
          email: friend.email,
          avatar: friend.avatar,
          status: "Offline",
        }));
        dispatch(setFriends(transformed));
      } catch (error) {
        console.error("Failed to fetch friends data");
      }
    };

    const fetchRequests = async () => {
      try {
        const data = await UserService.getFriendRequests(currentUser._id);
        dispatch(setPrevRequests(data));
        dispatch(setPendingRequests(data));
      } catch (error) {
        dispatch(setPendingRequests([]));
      }
    };

    fetchFriends();
    fetchRequests();
  }, [currentUser._id, dispatch]);

  // Tự động chọn channel text đầu tiên khi chọn server
  useEffect(() => {
    if (selectedServer && !selectedChannel) {
      const firstTextChannel = defaultChannels.find(
        (channel) => channel.type === "text"
      );
      if (firstTextChannel) {
        dispatch(setSelectedChannel(firstTextChannel));
      }
    }
  }, [selectedServer, selectedChannel, dispatch]);

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
        dispatch(setSelectedProfileFriend(friend));
        dispatch(setShowProfile(true));
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
    if (!server) {
      // Nếu server là null, reset trạng thái server
      dispatch(setSelectedServer(null));
      dispatch(setActiveTab("server"));
      dispatch(setSelectedFriend(null));
      return;
    }
    // Loại bỏ các thuộc tính không tuần tự hóa (ví dụ icon)
    const { icon, ...serializableServer } = server;
    dispatch(setSelectedServer(serializableServer));
    dispatch(setActiveTab("server"));
    dispatch(setSelectedFriend(null));
    const firstTextChannel = defaultChannels.find(
      (channel) => channel.type === "text"
    );
    if (firstTextChannel) {
      dispatch(setSelectedChannel(firstTextChannel));
    }
  };

  const handleChannelSelect = (channel) => {
    dispatch(setSelectedChannel(channel));
  };

  // Xử lý friend request
  const handleAcceptRequest = async (requestID) => {
    try {
      await UserService.acceptFriendRequest(requestID);
      dispatch(
        setPendingRequests(pendingRequests.filter((req) => req._id !== requestID))
      );
      dispatch(setNewRequests(newRequests.filter((req) => req._id !== requestID)));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeclineRequest = async (requestID) => {
    try {
      await UserService.declineFriendRequest(requestID);
      dispatch(
        setPendingRequests(pendingRequests.filter((req) => req._id !== requestID))
      );
      dispatch(setNewRequests(newRequests.filter((req) => req._id !== requestID)));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const handleCloseModal = () => {
    dispatch(setNewRequests([]));
  };

  // --- Routing tự động dựa trên nội dung chính ---
  // Nếu đang chọn server & channel thì điều hướng đến URL /server/{serverId}/{channelId}
  // Nếu đang ở DM (activeTab = "friend" và đã chọn friend) thì điều hướng đến /direct_message/{friendId}
  // Còn lại vẫn giữ "/" cho trạng thái Home của DM sidebar.
  useEffect(() => {
    if (selectedServer && selectedChannel) {
      // Ước tính id của server từ selectedServer (_id hoặc id)
      const serverId = selectedServer._id || selectedServer.id;
      navigate(`/server/${serverId}/${selectedChannel.id}`, { replace: true });
    } else if (activeTab === "friend" && selectedFriendObj) {
      navigate(`/direct_message/${selectedFriendObj._id}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [selectedServer, selectedChannel, activeTab, selectedFriendObj, navigate]);

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
          onShowCreateServer={() => dispatch(setShowCreateServer(true))}
        />
      </Suspense>

      {/* Channel/DM sidebar */}
      {selectedServer ? (
        // Channel sidebar (Server Mode)
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
        // DM sidebar (Home Mode)
        <Suspense fallback={<div>Loading DM Sidebar...</div>}>
          <DMSidebar
            isDarkMode={isDarkMode}
            activeTab={activeTab}
            setActiveTab={(tab) => dispatch(setActiveTab(tab))}
            setShowAddFriend={(show) => dispatch(setShowAddFriend(show))}
            selectedFriend={selectedFriend}
            setSelectedFriend={(friend) => dispatch(setSelectedFriend(friend))}
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
              {selectedChannel.type === "text" ? (
                <>
                  <ServerChat channel={selectedServer} />
                  <ServerMembers />
                </>
              ): (
                <>
                  <VoiceChat 
                    userId={currentUser._id || "Undefined"} 
                    channel={selectedChannel.id} 
                    onLeave={() => dispatch(setSelectedChannel(null))} 
                  />
                </>
              )}
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
              dispatch(setShowProfile(false));
              dispatch(setSelectedProfileFriend(null));
            }}
          />
        )}
      </Suspense>

      {/* Create server modal */}
      <Suspense fallback={<div>Loading Create Server Modal...</div>}>
        {showCreateServer && (
          <CreateServerModal onClose={() => dispatch(setShowCreateServer(false))} />
        )}
      </Suspense>

      {/* Friend request modal */}
      <Suspense fallback={<div>Loading Friend Request Modal...</div>}>
        {newRequests.length > 0 && activeTab !== "friend_requests" && (
          <FriendRequestModal
            requests={newRequests}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onClose={() => dispatch(setNewRequests([]))}
          />
        )}
      </Suspense>
    </div>
  );
}
