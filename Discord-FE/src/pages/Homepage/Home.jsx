import React, { useEffect, lazy, Suspense, useState } from "react";
import { Plus, Hash, Volume2, Users, UserPlus, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Các action của Redux từ homeSlice
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

// Gọi API qua UserService
import UserService from "../../services/UserService";

// Lazy load các component liên quan đến bạn bè (cho giao diện DM)
const DirectMessage = lazy(() =>
  import("../../components/friends/DirectMessage/DirectMessage")
);
const FriendsView = lazy(() => import("../../components/friends/FriendsView"));
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
const DMSidebar = lazy(() => import("../../components/friends/DMSidebar"));

// Lazy load ServerList, Server và các modal liên quan đến Server
const ServerList = lazy(() => import("../../components/server/ServerList"));
const Server = lazy(() => import("../../components/server/Server"));
const CreateServerModal = lazy(() =>
  import("../../components/server/CreateServerModal")
);

// Lazy load NotificationModal component mới
const NotificationModal = lazy(() =>
  import("../../components/user/NotificationModal")
);

// Lazy load UserProfile
const UserProfile = lazy(() => import("../../components/user/UserProfile"));

// Component không lazy
import UserPanel from "../../components/user/UserPanel";

export default function Home({ user }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State để điều khiển các modal
  const [profileModal, setProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Lấy state từ Redux
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

  // Lưu thông tin user vào localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_info", JSON.stringify(user));
    }
  }, [user]);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch dữ liệu bạn bè và yêu cầu kết bạn khi component mount
  useEffect(() => {
    if (!currentUser.id) return;

    const fetchFriends = async () => {
      try {
        const data = await UserService.getFriends(currentUser.id);
        const transformed = data.map((friend) => ({
          _id: friend.id,
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
        const data = await UserService.getFriendRequests(currentUser.id);
        dispatch(setPrevRequests(data));
        dispatch(setPendingRequests(data));
      } catch (error) {
        dispatch(setPendingRequests([]));
      }
    };

    fetchFriends();
    fetchRequests();
  }, [currentUser.id, dispatch]);

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
      dispatch(setSelectedServer(null));
      dispatch(setActiveTab("server"));
      dispatch(setSelectedFriend(null));
      return;
    }
    const { icon, ...serializableServer } = server;
    dispatch(setSelectedServer(serializableServer));
    dispatch(setActiveTab("server"));
    dispatch(setSelectedFriend(null));
  };

  const handleAcceptRequest = async (requestID) => {
    try {
      await UserService.acceptFriendRequest(requestID);
      dispatch(
        setPendingRequests(
          pendingRequests.filter((req) => req.id !== requestID)
        )
      );
      dispatch(
        setNewRequests(newRequests.filter((req) => req.id !== requestID))
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeclineRequest = async (requestID) => {
    try {
      await UserService.declineFriendRequest(requestID);
      dispatch(
        setPendingRequests(
          pendingRequests.filter((req) => req.id !== requestID)
        )
      );
      dispatch(
        setNewRequests(newRequests.filter((req) => req.id !== requestID))
      );
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  // Routing tự động dựa trên nội dung chính
  useEffect(() => {
    if (selectedServer && selectedChannel) {
      const serverId = selectedServer.id || selectedServer.id;
      navigate(`/server/${serverId}/${selectedChannel.id}`, { replace: true });
    } else if (activeTab === "friend" && selectedFriendObj) {
      navigate(`/direct_message/${selectedFriendObj.id}`, { replace: true });
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
      {/* Left Sidebar: Server List */}
      <Suspense fallback={<div>Loading Server List...</div>}>
        <ServerList
          selectedServer={selectedServer}
          onServerClick={handleServerClick}
          onShowCreateServer={() => dispatch(setShowCreateServer(true))}
        />
      </Suspense>

      {/* Main Container Server or DM */}
      <div className="flex-1 relative flex">
        {selectedServer ? (
          // Nếu có server được chọn, render giao diện Server
          <Suspense fallback={<div>Loading Server...</div>}>
            <Server
              selectedServer={selectedServer}
              user={user}
              selectedChannel={selectedChannel}
              onChannelSelect={(channel) => dispatch(setSelectedChannel(channel))}
            />
          </Suspense>
        ) : (
          // Nếu không có server thì render giao diện DM, gồm DM Sidebar và Main Content cho DM
          <>
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
                user={user}
              />
            </Suspense>
            <div
              className={`flex-1 h-full flex flex-col ${
                isDarkMode ? "bg-[#313338]" : "bg-[#F8F9FA]"
              }`}
            >
              {/* Header cho giao diện DM */}
              <div
                className={`h-12 min-h-[3rem] flex-shrink-0 border-b flex items-center px-4 justify-between cursor-pointer ${
                  isDarkMode ? "border-[#232428]" : "border-gray-300"
                }`}
              >
                <div
                  className={`h-12 min-h-[3rem] flex-shrink-0 flex items-center px-4 cursor-pointer ${
                    isDarkMode ? "border-[#232428]" : "border-gray-300"
                  }`}
                  onClick={() => {
                    if (selectedFriendObj) {
                      // Xử lý khi nhấn vào profile của friend (nếu cần)
                    }
                  }}
                >
                  {selectedFriendObj ? (
                    <>
                      <div className="w-8 h-8 rounded-full mr-2 overflow-hidden bg-[#36393f]">
                        <img
                          src={selectedFriendObj.avatar || "/placeholder.svg"}
                          alt={selectedFriendObj.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold">
                        {selectedFriendObj.username}
                      </span>
                    </>
                  ) : (
                    <>
                      <Users size={20} className="text-gray-400 mr-2" />
                      <span className="font-semibold">{t("Friend")}</span>
                    </>
                  )}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotificationModal((prev) => !prev);
                  }}
                  className="cursor-pointer"
                >
                  <Bell size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Nội dung chính DM */}
              <Suspense fallback={<div>Loading Main Content...</div>}>
                {activeTab === "friends" ? (
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
                  <DirectMessage friend={selectedFriendObj} messages={[]} />
                ) : (
                  <FriendsView />
                )}
              </Suspense>
            </div>
          </>
        )}

        {/* UserPanel được đặt tại góc dưới trái của Main Container (Server hoặc DM) */}
        <div className="absolute bottom-0 left-0 border-t border-gray-200 dark:border-[#2b2d31]">
          <UserPanel user={user} onProfileClick={() => setProfileModal(true)} />
        </div>
      </div>

      {/* Các modal chung */}
      {profileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setProfileModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Suspense fallback={<div>Loading User Profile...</div>}>
              <UserProfile user={user} onClose={() => setProfileModal(false)} />
            </Suspense>
          </div>
        </div>
      )}

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

      <Suspense fallback={<div>Loading Create Server Modal...</div>}>
        {showCreateServer && (
          <CreateServerModal
            onClose={() => dispatch(setShowCreateServer(false))}
          />
        )}
      </Suspense>

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

      {showNotificationModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotificationModal(false)}
        >
          <Suspense fallback={<div>Loading Notification Modal...</div>}>
            <NotificationModal
              onClose={() => setShowNotificationModal(false)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
