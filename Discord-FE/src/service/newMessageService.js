import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Kết nối WebSocket
const socket = new SockJS("http://localhost:8089/ws");
const stompClient = new Client({
  webSocketFactory: () => socket,
  debug: (str) => console.log(str),
  onConnect: () => {
    // ✅ Subscribe vào đúng topic
    stompClient.subscribe("/topic/server/default/channel/general", (message) => {
      const messageData = JSON.parse(message.body);
      console.log("Received via WebSocket:", messageData);
      // 👉 Hiển thị ra UI
    });
  },
});
