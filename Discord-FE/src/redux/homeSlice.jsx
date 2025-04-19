import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "friends",
  selectedFriend: null,
  friends: [],
  showProfile: false,
  selectedProfileFriend: null,
  selectedServer: null,
  selectedChannel: null,
  showCreateServer: false,
  showAddFriend: false,
  pendingRequests: [],
  prevRequests: [],
  newRequests: [],

  voiceChannel: null, // lưu thông tin kênh voice đang join (serverId, serverName, channelId, channelName)
  isMuted: false, // trạng thái mic

  // Danh sách thành viên trong server
  serverMembers: [],

  //Danh sách server
  servers: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // Biến đổi trạng thái của các tab trong ứng dụng
    // Ví dụ: chuyển đổi giữa tab bạn bè, tin nhắn, thông báo, v.v.
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    // Biến chọn bạn bè để chat hoặc xem hồ sơ
    // Ví dụ: khi người dùng nhấp vào một người bạn trong danh sách bạn bè
    setSelectedFriend(state, action) {
      state.selectedFriend = action.payload;
    },
    // Biến đổi danh sách bạn bè trong ứng dụng
    // Ví dụ: thêm, xóa hoặc cập nhật thông tin bạn bè
    setFriends(state, action) {
      state.friends = action.payload;
    },
    // Biến đổi trạng thái hiển thị hồ sơ người dùng
    // Ví dụ: khi người dùng nhấp vào một người bạn để xem hồ sơ của họ
    setShowProfile(state, action) {
      state.showProfile = action.payload;
    },
    // Biến đổi trạng thái của bạn bè trong hồ sơ người dùng
    // Ví dụ: khi người dùng nhấp vào một người bạn trong hồ sơ của họ
    setSelectedProfileFriend(state, action) {
      state.selectedProfileFriend = action.payload;
    },
    // Biến đổi trạng thái của máy chủ và kênh đã chọn
    // Ví dụ: khi người dùng chọn một máy chủ hoặc kênh cụ thể để tham gia
    setSelectedServer(state, action) {
      state.selectedServer = action.payload;
    },
    // Biến đổi trạng thái của kênh đã chọn trong máy chủ
    // Ví dụ: khi người dùng chọn một kênh cụ thể trong máy chủ
    setSelectedChannel(state, action) {
      state.selectedChannel = action.payload;
    },
    // Biến đổi trạng thái hiển thị cửa sổ tạo máy chủ
    // Ví dụ: khi người dùng nhấp vào nút "Tạo máy chủ" trong ứng dụng
    setShowCreateServer(state, action) {
      state.showCreateServer = action.payload;
    },
    // Biến đổi trạng thái hiển thị cửa sổ thêm bạn bè
    // Ví dụ: khi người dùng nhấp vào nút "Thêm bạn bè" trong ứng dụng
    setShowAddFriend(state, action) {
      state.showAddFriend = action.payload;
    },
    // Biến đổi trạng thái của các yêu cầu kết bạn đang chờ xử lý
    // Ví dụ: khi người dùng nhận được yêu cầu kết bạn mới từ người khác
    setPendingRequests(state, action) {
      state.pendingRequests = action.payload;
    },
    // Biến đổi trạng thái của các yêu cầu kết bạn đã được xử lý trước đó
    // Ví dụ: khi người dùng đã xử lý một yêu cầu kết bạn trước đó
    setPrevRequests(state, action) {
      state.prevRequests = action.payload;
    },
    // Biến đổi trạng thái của các yêu cầu kết bạn mới
    setNewRequests(state, action) {
      state.newRequests = action.payload;
    },
    // Xóa yêu cầu kết bạn khỏi danh sách các yêu cầu đang chờ xử lý
    removeRequest(state, action) {
      const requestID = action.payload;
      state.pendingRequests = state.pendingRequests.filter(
        (req) => req.id !== requestID
      );
      state.newRequests = state.newRequests.filter(
        (req) => req.id !== requestID
      );
    },

    // Tham gia Voice Channel
    joinVoiceChannel(state, action) {
      // payload = { serverId, serverName, channelId, channelName }
      state.voiceChannel = action.payload;
      state.isMuted = false; // mặc định unmute khi join kênh mới
    },
    // Rời Voice Channel
    leaveVoiceChannel(state) {
      state.voiceChannel = null;
      state.isMuted = false;
    },
    // Tắt/Bật mic
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },

    // Lưu danh sách thành viên server
    setServerMembers(state, action) {
      state.serverMembers = action.payload;
    },

    setServers(state, action) {
      state.servers = action.payload;
    },
  },
});

export const {
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
  removeRequest,
  joinVoiceChannel,
  leaveVoiceChannel,
  toggleMute,
  setServerMembers,
  setServers,
} = homeSlice.actions;

export default homeSlice.reducer;
