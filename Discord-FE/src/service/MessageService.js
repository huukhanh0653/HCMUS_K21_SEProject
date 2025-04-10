import { io } from "socket.io-client";
import { Message_API } from "../../apiConfig";

// Khởi tạo socket sử dụng Message_API
const socket = io(Message_API);

// Hàm join channel
const joinChannel = (channelId) => {
  socket.emit("joinChannel", channelId);
};

// Hàm fetch thêm tin nhắn
const fetchMoreMessages = (data) => {
  socket.emit("fetchMoreMessages", data);
};

// Hàm gửi tin nhắn
const sendMessage = (message) => {
  socket.emit("sendMessage", message);
};

// Hàm xóa tin nhắn
const deleteMessage = (channel_id, message_id) => {
  socket.emit("deleteMessage", { channel_id, message_id });
};

// Hàm chỉnh sửa tin nhắn
const editMessage = (data) => {
  socket.emit("editMessage", data);
};

// Các hàm đăng ký lắng nghe sự kiện
const onMoreMessages = (callback) => {
  socket.on("moreMessages", callback);
};

const onReceiveMessage = (callback) => {
  socket.on("receiveMessage", callback);
};

const onMessageUpdated = (callback) => {
  socket.on("messageUpdated", callback);
};

const onMessageDeleted = (callback) => {
  socket.on("messageDeleted", callback);
};

// Hàm tắt tất cả các listener (sử dụng trong cleanup)
const offAllListeners = () => {
  socket.off();
};

// Xuất đối tượng MessageService với tất cả các hàm cần thiết
const MessageService = {
  socket,
  joinChannel,
  fetchMoreMessages,
  sendMessage,
  deleteMessage,
  editMessage,
  onMoreMessages,
  onReceiveMessage,
  onMessageUpdated,
  onMessageDeleted,
  offAllListeners,
};

export default MessageService;
