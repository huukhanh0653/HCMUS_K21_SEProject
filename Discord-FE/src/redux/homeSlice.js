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
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSelectedFriend(state, action) {
      state.selectedFriend = action.payload;
    },
    setFriends(state, action) {
      state.friends = action.payload;
    },
    setShowProfile(state, action) {
      state.showProfile = action.payload;
    },
    setSelectedProfileFriend(state, action) {
      state.selectedProfileFriend = action.payload;
    },
    setSelectedServer(state, action) {
      state.selectedServer = action.payload;
    },
    setSelectedChannel(state, action) {
      state.selectedChannel = action.payload;
    },
    setShowCreateServer(state, action) {
      state.showCreateServer = action.payload;
    },
    setShowAddFriend(state, action) {
      state.showAddFriend = action.payload;
    },
    setPendingRequests(state, action) {
      state.pendingRequests = action.payload;
    },
    setPrevRequests(state, action) {
      state.prevRequests = action.payload;
    },
    setNewRequests(state, action) {
      state.newRequests = action.payload;
    },
    removeRequest(state, action) {
      const requestID = action.payload;
      state.pendingRequests = state.pendingRequests.filter(req => req._id !== requestID);
      state.newRequests = state.newRequests.filter(req => req._id !== requestID);
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
} = homeSlice.actions;

export default homeSlice.reducer;
