import axios from "axios";

// API base URL from Vite environment
const User_API = import.meta.env.VITE_USER_API;

// --------------------
// Các hàm gọi API liên quan đến bạn bè và yêu cầu kết bạn
// --------------------
const getFriends = async (userId) => {
  try {
    const response = await axios.get(`${User_API}/api/friends/${userId}`, {
      headers: { accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching friends data:", error);
    throw error;
  }
};

const addFriend = async (userId, friendId) => {
  try {
    const response = await axios.post(
      `${User_API}/api/friends/add`,
      {
        user_id: userId,
        friend_id: friendId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};

const removeFriend = async (userId, friendId) => {
  try {
    const response = await axios.delete(`${User_API}/api/friends/remove`, {
      headers: { "Content-Type": "application/json" },
      data: {
        user_id: userId,
        friend_id: friendId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

const sendFriendRequest = async (userId, friendId) => {
  try {
    const response = await axios.post(
      `${User_API}/api/friends/request`,
      {
        user_id: userId,
        friend_id: friendId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

const getFriendRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${User_API}/api/friends/requests/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

const acceptFriendRequest = async (requestID) => {
  try {
    const response = await axios.post(
      `${User_API}/api/friends/request/accept`,
      { requestID },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

const declineFriendRequest = async (requestID) => {
  try {
    const response = await axios.post(
      `${User_API}/api/friends/request/decline`,
      { requestID },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Error declining friend request:", error);
    throw error;
  }
};

// --------------------
// Các hàm gọi API liên quan đến block
// --------------------
const getBlockedFriends = async (userId) => {
  try {
    const response = await axios.get(`${User_API}/api/blocks/${userId}`, {
      headers: { accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blocked friends:", error);
    throw error;
  }
};

const addBlock = async (userId, friendId) => {
  try {
    const response = await axios.post(
      `${User_API}/api/blocks`,
      {
        user_id: userId,
        friend_id: friendId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding block:", error);
    throw error;
  }
};

const removeBlock = async (userId, friendId) => {
  try {
    const response = await axios.delete(`${User_API}/api/blocks`, {
      headers: { "Content-Type": "application/json" },
      data: {
        user_id: userId,
        friend_id: friendId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing block:", error);
    throw error;
  }
};

// --------------------
// Các hàm gọi API liên quan đến người dùng
// --------------------

/**
 * Đồng bộ user từ Firebase với backend.
 * @param {string} uid
 * @param {string} email
 */
const syncFirebaseUser = async (uid, email) => {
  try {
    const response = await axios.post(
      `${User_API}/api/users/sync-firebase`,
      { uid, email },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Error syncing firebase user:", error);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng theo email.
 * @param {string} email
 * @returns {Promise<Object>}
 */
const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${User_API}/api/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng theo ID.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const getUserByID = async (userId) => {
  try {
    const response = await axios.get(`${User_API}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

/**
 * Lấy danh sách users.
 * @returns {Promise<Object>}
 */
export const getUsers = async () => {
  const response = await axios.get(`${User_API}/api/users`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

/**
 * Tạo user mới trong hệ thống.
 * @param {Object} userData - Chứa các thuộc tính của user.
 */
const createUser = async (userData) => {
  try {
    const response = await axios.post(`${User_API}/api/users`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Sửa thông tin user trong hệ thống.
 * @param {string} userId
 * @param {Object} userData - Chứa các thuộc tính của user.
 */
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${User_API}/api/users/${userId}`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// --------------------
// Xuất đối tượng UserService gồm các hàm trên
// --------------------
const UserService = {
  // Bạn bè & friend requests
  getFriends,
  addFriend,
  removeFriend,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,

  // Block
  getBlockedFriends,
  addBlock,
  removeBlock,

  // Người dùng
  syncFirebaseUser,
  getUserByID,
  getUserByEmail,
  getUsers,
  createUser,
  updateUser,
};

export default UserService;
