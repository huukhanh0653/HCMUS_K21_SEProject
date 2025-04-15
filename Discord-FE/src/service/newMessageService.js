import SockJS from "sockjs-client";
import Stomp from "stompjs";
require("dotenv").config();

const connectMessageService = (stompClientRef, setChatMessages) => {
  const socket = new SockJS(`http://localhost:${PORT}/ws`);
  const stompClient = Stomp.over(socket);
  stompClientRef.current = stompClient;

  stompClient.connect({}, () => {
    stompClient.subscribe(
      `/topic/server/${SERVER_ID}/channel/${CHANNEL_ID}`,
      (msg) => {
        const received = JSON.parse(msg.body);
        setChatMessages((prev) => [...prev, received]);
      }
    );
  });

  return () => {
    stompClient.disconnect();
  };
};
