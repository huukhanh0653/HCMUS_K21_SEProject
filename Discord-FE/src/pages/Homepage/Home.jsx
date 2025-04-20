import React, { useEffect, lazy, Suspense, useState } from "react";
import { Plus, Hash, Volume2, Users, UserPlus, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Redux actions
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
  setPrevRequests,
  setPendingRequests,
  setNewRequests,
  setServers,
} from "../../redux/homeSlice";

// Services
import UserService from "../../services/UserService";
import ServerChannelService from "../../services/ServerChannelService";

// Lazy components
const ServerList = lazy(() => import("../../components/server/ServerList"));
const Server = lazy(() => import("../../components/server/Server"));
const CreateServerModal = lazy(() =>
  import("../../components/server/CreateServerModal")
);
const DMSidebar = lazy(() => import("../../components/friends/DMSidebar"));
const FriendList = lazy(() => import("../../components/friends/FriendList"));
const AddFriend = lazy(() => import("../../components/friends/AddFriend"));
const FriendRequests = lazy(() =>
  import("../../components/friends/FriendRequests")
);
const BlockedFriends = lazy(() =>
  import("../../components/friends/BlockedFriends")
);
const DirectMessage = lazy(() =>
  import("../../components/friends/DirectMessage/DirectMessage")
);
const FriendsView = lazy(() => import("../../components/friends/FriendsView"));
const FriendProfile = lazy(() =>
  import("../../components/friends/FriendProfile")
);
const FriendRequestModal = lazy(() =>
  import("../../components/friends/FriendRequestModal")
);
const NotificationModal = lazy(() =>
  import("../../components/user/NotificationModal")
);
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
    servers,
  } = useSelector((state) => state.home);

  const loadServers = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const resp = await ServerChannelService.getServers(currentUser.id);
      dispatch(setServers(resp.servers || []));
    } catch (err) {
      console.error("Error loading servers", err);
    }
  };

  // Fetch servers
  useEffect(() => {
    loadServers();
  }, [dispatch]);

  // Lưu thông tin user vào localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_info", JSON.stringify(user));
    }
  }, [user]);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch dữ liệu bạn bè và yêu cầu kết bạn khi component mount
  const refreshFriends = async () => {
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

  useEffect(() => {
    if (!currentUser.id) return;

    const fetchFriends = async () => {
      await refreshFriends();
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
    ? friends.find((f) => f._id === selectedFriend)
    : null;

  const handleFriendAction = async (action, friend) => {
    switch (action) {
      case "profile":
        dispatch(setSelectedProfileFriend(friend));
        dispatch(setShowProfile(true));
        break;
      case "unfriend":
        try {
          await UserService.removeFriend(currentUser.id, friend._id);
          toast.success(t("Successfully unfriended friend"));
          await refreshFriends();
        } catch (error) {
          console.error("Error unfriending friend:", error);
          toast.error(t("Failed to unfriend"));
        }
        break;
      case "block":
        try {
          await UserService.addBlock(currentUser.id, friend._id);
          toast.success(t("Successfully blocked friend"));
          await refreshFriends();
        } catch (error) {
          console.error("Error blocking friend:", error);
          toast.error(t("Failed to block"));
        }
        break;
      case "message":
        dispatch(setSelectedFriend(friend.username));
        dispatch(setActiveTab("friend"));
        dispatch(setShowAddFriend(false));
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const handleServerClick = (srv) => {
    if (!srv) {
      dispatch(setSelectedServer(null));
      dispatch(setActiveTab("server"));
      dispatch(setSelectedFriend(null));
      return;
    }
    dispatch(setSelectedServer(srv));
    dispatch(setActiveTab("server"));
    dispatch(setSelectedFriend(null));
  };

  // Đồng ý kết bạn
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
      await refreshFriends();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Từ chối kết bạn
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
      navigate(`/server/${selectedServer.id}/${selectedChannel.id}`, {
        replace: true,
      });
    } else if (activeTab === "friend" && selectedFriend) {
      const f = friends.find((x) => x.username === selectedFriend);
      if (f) navigate(`/direct_message/${f._id}`, { replace: true });
    } else navigate("/", { replace: true });
  }, [
    selectedServer,
    selectedChannel,
    activeTab,
    selectedFriend,
    navigate,
    friends,
  ]);

  return (
    <div
      className={`fixed inset-0 flex h-screen w-screen overflow-hidden ${
        isDarkMode
          ? "bg-[#313338] text-gray-100"
          : "bg-[#F8F9FA] text-[#333333]"
      }`}
    >
      {/* Left Sidebar: Server List */}
      <Suspense fallback={<div>Loading servers...</div>}>
        <ServerList
          servers={servers}
          loading={false}
          error={null}
          selectedServer={selectedServer}
          onServerClick={handleServerClick}
          onShowCreateServer={() => dispatch(setShowCreateServer(true))}
        />
      </Suspense>

      {/* Main Container Server or DM */}
      <div className="flex-1 relative flex">
        {selectedServer ? (
          <Suspense fallback={<div>Server loading...</div>}>
            <Server
              selectedServer={selectedServer}
              user={user}
              selectedChannel={selectedChannel}
              onChannelSelect={(ch) => dispatch(setSelectedChannel(ch))}
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
                setSelectedFriend={(friend) =>
                  dispatch(setSelectedFriend(friend))
                }
                friends={friends}
                handleFriendAction={handleFriendAction}
                getStatusColor={getStatusColor}
                refreshFriends={refreshFriends}
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
                      dispatch(setSelectedProfileFriend(selectedFriendObj));
                      dispatch(setShowProfile(true));
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
              {/* Log activeTab and selectedFriend for debugging */}
              {(() => {
                console.log("activeTab:", activeTab);
                console.log("Friend:", selectedFriend);
                console.log("Friends:", friends);
                console.log("selectedFriendObj:", selectedFriendObj);
              })()}{" "}
              {/* Nội dung chính DM */}
              <Suspense fallback={<div>Loading Main Content...</div>}>
                {activeTab === "friends" ? (
                  <FriendList
                    setActiveTab={(tab) => dispatch(setActiveTab(tab))}
                    setSelectedFriend={(friend) => {
                      dispatch(setSelectedFriend(friend));
                    }}
                    refreshFriends={refreshFriends}
                  />
                ) : activeTab === "addfriend" ? (
                  <AddFriend />
                ) : activeTab === "friend_requests" ? (
                  <FriendRequests
                    friendRequests={pendingRequests}
                    onAccept={handleAcceptRequest}
                    onDecline={handleDeclineRequest}
                  />
                ) : activeTab === "blocked_friends" ? (
                  <BlockedFriends onUnblock={refreshFriends} />
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
            setActiveTab={(tab) => dispatch(setActiveTab(tab))}
            setSelectedFriend={(friend) => {
              dispatch(setSelectedFriend(friend));
            }}
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
            onLoad={loadServers}
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
