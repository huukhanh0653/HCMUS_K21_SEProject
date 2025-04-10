package com.DiscordClone.NotificationService.service;

import com.DiscordClone.NotificationService.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketNotificationHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToUser(String userId, Notification notification) {
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
    }

    // Optional: handle channel or server topics here if needed
    public void sendToChannel(String channelId, Notification notification) {
        messagingTemplate.convertAndSend("/topic/channel/" + channelId, notification);
    }

    public void sendToServer(String serverId, Notification notification) {
        messagingTemplate.convertAndSend("/topic/server/" + serverId, notification);
    }
}
