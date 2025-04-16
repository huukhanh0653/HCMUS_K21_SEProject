import SockJS from "sockjs-client";
import Stomp from "stompjs";
// Không sử dụng dotenv vì require không được định nghĩa trong trình duyệt
// require("dotenv").config();

const connectMessageService = (stompClientRef, setChatMessages, serverId, channelId) => {
  console.log("Opening Web Socket...");
  const socket = new SockJS(`http://localhost:8089/ws`);
  const stompClient = Stomp.over(socket);
  stompClientRef.current = stompClient;

  stompClient.connect({}, () => {
    console.log("Connected to STOMP");
    // Subscribe vào topic để nhận các tin nhắn từ backend
    const subscription = stompClient.subscribe(
      `/topic/server/${serverId}/channel/${channelId}`,
      (msg) => {
        const received = JSON.parse(msg.body);
        // Chuyển object content: { text: "kak" } -> "kak"
        const updatedReceived = {
          ...received,
          content: typeof received.content === "object" && received.content.text
            ? received.content.text
            : received.content
        };

        setChatMessages((prev) => [...prev, updatedReceived]);
      }
    );
  });

  // Hàm cleanup ngắt kết nối nếu cần
  return () => {
    console.log("Disconnecting STOMP client...");
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log(">>> DISCONNECT");
      });
    }
  };
};

export { connectMessageService };
