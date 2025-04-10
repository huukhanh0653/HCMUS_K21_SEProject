package com.DiscordClone.NotificationService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.concurrent.CompletableFuture;

@Slf4j
public class WebSocketTestClient {

    private static final String WEBSOCKET_URI = "ws://localhost:8085/ws"; // adjust as needed
    private static final String SUBSCRIBE_TOPIC = "/topic/notifications/user123"; // your userId

    public static void main(String[] args) throws Exception {
        WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        CompletableFuture<Void> connectionEstablished = new CompletableFuture<>();

        StompSessionHandler sessionHandler = new StompSessionHandlerAdapter() {
            @Override
            public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
                log.info("✅ Connected to WebSocket server");
                session.subscribe(SUBSCRIBE_TOPIC, new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders headers) {
                        return Object.class;
                    }

                    @Override
                    public void handleFrame(StompHeaders headers, Object payload) {
                        log.info("🔔 Notification received: {}", payload);
                    }
                });
                log.info("📡 Subscribed to {}", SUBSCRIBE_TOPIC);
                connectionEstablished.complete(null);
            }

            @Override
            public void handleTransportError(StompSession session, Throwable exception) {
                log.error("❌ Transport error", exception);
                connectionEstablished.completeExceptionally(exception);
            }
        };

        stompClient.connectAsync(WEBSOCKET_URI, new WebSocketHttpHeaders(), sessionHandler);

        // Wait for connection to establish or fail
        connectionEstablished.join();

        // Keep alive to receive messages
        Thread.sleep(10 * 60 * 1000); // 10 minutes
    }
}
