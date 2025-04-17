import axios from "axios";
import { Server_API } from "../../apiConfig";

// --------------------
// Các hàm gọi API liên quan đến Server
// --------------------

/**
 * Tạo một server mới.
 * @param {string} userId - ID của người dùng.
 * @param {Object} serverData - Dữ liệu server (name, server_pic).
 * @returns {Promise<Object>}
 */
const createServer = async (userId, serverData) => {
  try {
    const response = await axios.post(
      `${Server_API}/servers/${userId}`,
      serverData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả server theo từ khóa tìm kiếm.
 * @param {string} userId - ID của người dùng.
 * @param {string} query - Từ khóa tìm kiếm.
 * @returns {Promise<Object>}
 */
const getAllServers = async (userId, query) => {
  try {
    const response = await axios.get(
      `${Server_API}/servers/${userId}/all?query=${encodeURIComponent(query)}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching all servers:", error);
    throw error;
  }
};

/**
 * Lấy danh sách server của người dùng.
 * @param {string} userId - ID của người dùng.
 * @param {string} query - Từ khóa tìm kiếm.
 * @returns {Promise<Object>}
 */
const getServers = async (userId, query) => {
  try {
    const response = await axios.get(
      `${Server_API}/servers/${userId}?query=${encodeURIComponent(query)}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user servers:", error);
    throw error;
  }
};

/**
 * Lấy một server theo ID.
 * @param {string} serverId - ID của server.
 * @returns {Promise<Object>}
 */
const getServerById = async (serverId) => {
  try {
    const response = await axios.get(`${Server_API}/servers/${serverId}/one`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching server:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin server.
 * @param {string} serverId - ID của server.
 * @param {string} userId - ID của người dùng.
 * @param {Object} serverData - Dữ liệu server (name, server_pic).
 * @returns {Promise<Object>}
 */
const updateServer = async (serverId, userId, serverData) => {
  try {
    const response = await axios.put(
      `${Server_API}/servers/${userId}/${serverId}`,
      serverData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating server:", error);
    throw error;
  }
};

/**
 * Xóa server.
 * @param {string} serverId - ID của server.
 * @param {string} userId - ID của người dùng.
 * @returns {Promise<Object>}
 */
const deleteServer = async (serverId, userId) => {
  try {
    const response = await axios.delete(
      `${Server_API}/servers/${userId}/${serverId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting server:", error);
    throw error;
  }
};

// --------------------
// Các hàm gọi API liên quan đến Server Member
// --------------------

/**
 * Thêm thành viên vào server.
 * @param {string} serverId - ID của server.
 * @param {string} userId - ID của người dùng thực hiện.
 * @param {Object} memberData - Dữ liệu thành viên (memberId, role).
 * @returns {Promise<Object>}
 */
const addServerMember = async (serverId, userId, memberData) => {
  try {
    const response = await axios.post(
      `${Server_API}/server-members/${serverId}/${userId}`,
      memberData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding server member:", error);
    throw error;
  }
};

/**
 * Xóa thành viên khỏi server.
 * @param {string} serverId - ID của server.
 * @param {string} userId - ID của người dùng thực hiện.
 * @param {string} memberId - ID của thành viên cần xóa.
 * @returns {Promise<Object>}
 */
const removeServerMember = async (serverId, userId, memberId) => {
  try {
    const response = await axios.delete(
      `${Server_API}/server-members/${serverId}/${userId}/${memberId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error removing server member:", error);
    throw error;
  }
};

/**
 * Cập nhật vai trò của thành viên trong server.
 * @param {string} serverId - ID của server.
 * @param {string} userId - ID của người dùng thực hiện.
 * @param {Object} memberData - Dữ liệu thành viên (memberId, role).
 * @returns {Promise<Object>}
 */
const updateServerMemberRole = async (serverId, userId, memberData) => {
  try {
    const response = await axios.put(
      `${Server_API}/server-members/${serverId}/${userId}`,
      memberData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating server member role:", error);
    throw error;
  }
};

/**
 * Tìm kiếm thành viên trong server.
 * @param {string} serverId - ID của server.
 * @param {string} query - Từ khóa tìm kiếm.
 * @returns {Promise<Object>}
 */
const searchServerMember = async (serverId, query = "") => {
  try {
    const response = await axios.get(
      `${Server_API}/server-members/${serverId}?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error searching server members:", error);
    throw error;
  }
};

// --------------------
// Các hàm gọi API liên quan đến Role
// --------------------

/**
 * Tạo vai trò mới trong server.
 * @param {string} serverId - ID của server.
 * @param {Object} roleData - Dữ liệu vai trò (name, color, position, is_default).
 * @returns {Promise<Object>}
 */
const createRole = async (serverId, roleData) => {
  try {
    const response = await axios.post(
      `${Server_API}/roles/${serverId}`,
      roleData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

/**
 * Lấy vai trò theo tên trong server.
 * @param {string} serverId - ID của server.
 * @param {string} name - Tên vai trò.
 * @returns {Promise<Object>}
 */
const getRoleByName = async (serverId, name) => {
  try {
    const response = await axios.get(
      `${Server_API}/roles/${serverId}/${encodeURIComponent(name)}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting role by name:", error);
    throw error;
  }
};

/**
 * Lấy danh sách vai trò trong server.
 * @param {string} serverId - ID của server.
 * @returns {Promise<Object>}
 */
const getRolesByServer = async (serverId) => {
  try {
    const response = await axios.get(`${Server_API}/roles/${serverId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getting roles by server:", error);
    throw error;
  }
};

/**
 * Cập nhật vai trò.
 * @param {string} roleId - ID của vai trò.
 * @param {Object} roleData - Dữ liệu vai trò (name, color, position, is_default).
 * @returns {Promise<Object>}
 */
const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(
      `${Server_API}/roles/${roleId}`,
      roleData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

/**
 * Xóa vai trò.
 * @param {string} roleId - ID của vai trò.
 * @returns {Promise<Object>}
 */
const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${Server_API}/roles/${roleId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

// --------------------
// Các hàm gọi API liên quan đến Channel
// --------------------

/**
 * Tạo channel mới trong server.
 * @param {string} serverId - ID của server.
 * @param {string} userId - ID của người dùng.
 * @param {Object} channelData - Dữ liệu channel (name, type, isPrivate).
 * @returns {Promise<Object>}
 */
const createChannel = async (serverId, userId, channelData) => {
  try {
    const response = await axios.post(
      `${Server_API}/channels/${userId}/${serverId}`,
      channelData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};

/**
 * Lấy danh sách channel trong server.
 * @param {string} serverId - ID của server.
 * @param {string} query - Từ khóa tìm kiếm.
 * @returns {Promise<Object>}
 */
const getChannelsByServer = async (serverId, query = "") => {
  try {
    const response = await axios.get(
      `${Server_API}/channels/${serverId}?query=${encodeURIComponent(query)}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting channels by server:", error);
    throw error;
  }
};

/**
 * Cập nhật channel.
 * @param {string} channelId - ID của channel.
 * @param {string} userId - ID của người dùng.
 * @param {Object} channelData - Dữ liệu channel (name, type, isPrivate).
 * @returns {Promise<Object>}
 */
const updateChannel = async (channelId, userId, channelData) => {
  try {
    const response = await axios.put(
      `${Server_API}/channels/${userId}/${channelId}`,
      channelData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating channel:", error);
    throw error;
  }
};

/**
 * Xóa channel.
 * @param {string} channelId - ID của channel.
 * @param {string} userId - ID của người dùng.
 * @returns {Promise<Object>}
 */
const deleteChannel = async (channelId, userId) => {
  try {
    const response = await axios.delete(
      `${Server_API}/channels/${userId}/${channelId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting channel:", error);
    throw error;
  }
};

// --------------------
// Các hàm gọi API liên quan đến Channel Member
// --------------------

/**
 * Thêm thành viên vào channel.
 * @param {string} channelId - ID của channel.
 * @param {string} userId - ID của người dùng thực hiện.
 * @param {string} memberId - ID của thành viên cần thêm.
 * @returns {Promise<Object>}
 */
const addChannelMember = async (channelId, userId, memberId) => {
  try {
    const response = await axios.post(
      `${Server_API}/channel-members/${channelId}/${userId}/${memberId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding channel member:", error);
    throw error;
  }
};

/**
 * Xóa thành viên khỏi channel.
 * @param {string} channelId - ID của channel.
 * @param {string} userId - ID của người dùng thực hiện.
 * @param {string} memberId - ID của thành viên cần xóa.
 * @returns {Promise<Object>}
 */
const removeChannelMember = async (channelId, userId, memberId) => {
  try {
    const response = await axios.delete(
      `${Server_API}/channel-members/${channelId}/${userId}/${memberId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error removing channel member:", error);
    throw error;
  }
};

/**
 * Tìm kiếm thành viên trong channel.
 * @param {string} channelId - ID của channel.
 * @param {string} query - Từ khóa tìm kiếm.
 * @returns {Promise<Object>}
 */
const searchChannelMember = async (channelId, query = "") => {
  try {
    const response = await axios.get(
      `${Server_API}/channel-members/${channelId}?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error searching channel members:", error);
    throw error;
  }
};

// --------------------
// Xuất đối tượng ServerChannelService gồm các hàm trên
// --------------------
const ServerChannelService = {
  // Server
  createServer,
  getAllServers,
  getServers,
  getServerById,
  updateServer,
  deleteServer,

  // Server Member
  addServerMember,
  removeServerMember,
  updateServerMemberRole,
  searchServerMember,

  // Role
  createRole,
  getRoleByName,
  getRolesByServer,
  updateRole,
  deleteRole,

  // Channel
  createChannel,
  getChannelsByServer,
  updateChannel,
  deleteChannel,

  // Channel Member
  addChannelMember,
  removeChannelMember,
  searchChannelMember,
};

export default ServerChannelService;
