import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// Lấy danh sách users
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/firebase`);
  return response.data;
};

// Xóa user theo ID
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
  return response.data;
};
