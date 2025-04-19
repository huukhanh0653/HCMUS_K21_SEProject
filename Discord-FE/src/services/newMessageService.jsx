import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { gql, useQuery, useMutation } from "@apollo/client";
// Không sử dụng dotenv vì require không được định nghĩa trong trình duyệt
// require("dotenv").config();

const WS_URL =
  import.meta.env.DEV
    ? "http://localhost:8082/ws"    // directly hit your backend in dev
    : "/ws";                        // when built, relative URL still works

const connectMessageService = (
  stompClientRef,
  setChatMessages,
  serverId,
  channelId
) => {
  console.log("Opening Web Socket...");
  const socket = new SockJS(WS_URL);
  const stompClient = Stomp.over(socket);
  stompClientRef.current = stompClient;

  stompClient.connect({}, () => {
    console.log("Connected to STOMP");
    // Subscribe vào topic để nhận các tin nhắn từ backend
    const subscription = stompClient.subscribe(
      `/topic/server/${serverId}/channel/${channelId}`,
      (msg) => {
        const received = JSON.parse(msg.body);
        const content =
          typeof received.content === "object" && received.content.text
            ? received.content.text
            : received.content;
        setChatMessages((prev) => [
          ...prev,
          { ...received, content }
        ]);
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

// Hàm ngắt kết nối
const disconnectMessageService = (stompClientRef) => {
  console.log("Disconnecting STOMP client...");
  if (stompClientRef.current && stompClientRef.current.connected) {
    stompClientRef.current.disconnect(() => console.log(">>> STOMP disconnected"));
  }
};

// GrapQL API URL

const GRAPHQL_API_URL = "/graphql"; // Địa chỉ GraphQL API của bạn

function useSearchMessages({ serverId, channelId, keyword }) {
  const SEARCH_MESSAGES = gql`
    query SearchMessages(
      $content: String!
      $serverId: String!
      $channelId: String!
    ) {
      searchMessages(
        content: $content
        serverId: $serverId
        channelId: $channelId
      ) {
        messageId
        content
        senderId
        timestamp
      }
    }
  `;

  return useQuery(SEARCH_MESSAGES, {
    variables: { content, serverId, channelId },
  });
}


function useFetchMessagesBefore({ serverId, channelId, amount, timestamp }) {
  const FETCH_MESSAGES_BEFORE = gql`
    query FetchMessagesBefore(
      $serverId: String!
      $channelId: String!
      $amount: Int!
      $timestamp: String!
    ) {
      fetchMessagesBefore(
        serverId: $serverId
        channelId: $channelId
        amount: $amount
        timestamp: $timestamp
      ) {
        messages {
          messageId
          content
          senderId
          timestamp
          serverId
          channelId
          attachments
          mentions
        }
        hasMore
        lastMessageTimestamp
        amount
      }
    }
  `;

  // nếu timestamp được truyền vào là Date, convert về ISO string
  const ts =
    timestamp instanceof Date
      ? timestamp.toISOString()
      : String(timestamp);
  return useQuery(FETCH_MESSAGES_BEFORE, {
    variables: { serverId, channelId, amount, timestamp:ts },
  });
}

function useFetchMessagesAfter({ serverId, channelId, amount, timestamp }) {
  const FETCH_MESSAGES_AFTER = gql`
    query FetchMessagesAfter(
      $serverId: String!
      $channelId: String!
      $amount: Int!
      $timestamp: String!
    ) {
      fetchMessagesAfter(
        serverId: $serverId
        channelId: $channelId
        amount: $amount
        timestamp: $timestamp
      ) {
        messages {
          messageId
          content
          senderId
          timestamp
          serverId
          channelId
          attachments
          mentions
        }
        hasMore
        lastMessageTimestamp
        amount
      }
    }
  `;

  return useQuery(FETCH_MESSAGES_AFTER, {
    variables: { serverId, channelId, amount, timestamp },
  });
}

function useEditMessage() {
  const EDIT_MESSAGE = gql`
    mutation EditMessage(
      $serverId: String!
      $channelId: String!
      $messageId: String!
      $content: String!
    ) {
      editMessage(
        serverId: $serverId
        channelId: $channelId
        messageId: $messageId
        content: $content
      ) {
        messageId
        content
        senderId
        timestamp
        serverId
        channelId
        attachments
        mentions
      }
    }
  `;

  return useMutation(EDIT_MESSAGE);
}

function useDeleteMessage() {
  const DELETE_MESSAGE = gql`
    mutation DeleteMessage(
      $serverId: String!
      $channelId: String!
      $messageId: String!
    ) {
      deleteMessage(
        serverId: $serverId
        channelId: $channelId
        messageId: $messageId
      )
    }
  `;
  return useMutation(DELETE_MESSAGE);
}

export { connectMessageService, disconnectMessageService, useSearchMessages, 
useFetchMessagesBefore, useFetchMessagesAfter, useEditMessage, useDeleteMessage };

//-- Example usage of useSearchMessages in a component
//--------------------------------------------------------------
// import { useSearchMessages } from './path/to/your/service';

//-> Hàm nào có chữ "query" thì dùng giống vầy
// const { data, loading, error } = useSearchMessages({
//   content: "hello",
//   serverId: "abc",
//   channelId: "xyz",
// });

//-> Hàm nào có chữ "mutation" thì dùng giống vầy
//const [editMessage] = useEditMessage();
// await editMessage({ variables: { serverId: 'a', channelId: 'b', messageId: 'c', content: 'đổi nội dung' } });