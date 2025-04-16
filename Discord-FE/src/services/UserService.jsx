import axios from "axios";
import { User_API } from "../../apiConfig";

// --------------------
// Các hàm gọi API liên quan đến bạn bè và yêu cầu kết bạn
// --------------------
const getFriends = async (userId) => {
  try {
    const response = await axios.get(`${User_API}/api/friendships/${userId}`, {
      headers: { accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching friends data:", error);
    throw error;
  }
};

const getFriendRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${User_API}/api/friendships/requests/${userId}`
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
      `${User_API}/api/friendships/request/accept`,
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
      `${User_API}/api/friendships/request/decline`,
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
 * Xóa user theo ID
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const deleteUser = async (userId) => {
  const response = await axios.delete(`${User_API}/api/users/${userId}`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

/**
 * Tạo user mới trong hệ thống.
 * @param {Object} userData - Chứa các thuộc tính uid, email, username, password, phone.
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

// --------------------
// Xuất đối tượng UserService gồm các hàm trên
// --------------------
const UserService = {
  // Bạn bè & friend requests
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,

  // Người dùng
  syncFirebaseUser,
  getUserByID,
  getUserByEmail,
  getUsers,
  deleteUser,
  createUser,
};

export default UserService;
