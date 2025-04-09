import { User_API } from "../../apiConfig";

// --------------------
// Các hàm gọi API liên quan đến bạn bè và yêu cầu kết bạn
// --------------------
const getFriends = async (userId) => {
  try {
    const response = await fetch(`${User_API}/api/friendships/${userId}`, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch friends data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching friends data:", error);
    throw error;
  }
};

const getFriendRequests = async (userId) => {
  try {
    const response = await fetch(`${User_API}/api/friendships/requests/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch friend requests");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

const acceptFriendRequest = async (requestID) => {
  try {
    const response = await fetch(`${User_API}/api/friendships/request/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestID }),
    });
    if (!response.ok) {
      throw new Error("Failed to accept friend request");
    }
    return response;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

const declineFriendRequest = async (requestID) => {
  try {
    const response = await fetch(`${User_API}/api/friendships/request/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestID }),
    });
    if (!response.ok) {
      throw new Error("Failed to decline friend request");
    }
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
    const response = await fetch(`${User_API}/api/users/sync-firebase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, email }),
    });
    if (!response.ok) {
      throw new Error("Failed to sync firebase user");
    }
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
    const response = await fetch(`${User_API}/api/users/email/${email}`);
    if (!response.ok) {
      throw new Error("Failed to get user by email");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

/**
 * Tạo user mới trong hệ thống.
 * @param {Object} userData - Chứa các thuộc tính uid, email, username, password, phone.
 */
const createUser = async (userData) => {
  try {
    const response = await fetch(`${User_API}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
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
  getUserByEmail,
  createUser,
};

export default UserService;