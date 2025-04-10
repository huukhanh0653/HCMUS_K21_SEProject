package com.DiscordClone.NotificationService.Websocket;

import com.DiscordClone.NotificationService.model.Notification;
import com.DiscordClone.NotificationService.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class NotificationWebSocketController {

    private final NotificationService notificationService;

    @MessageMapping("/notify")
    public void receiveMessage(Notification notification) {
        notificationService.sendNotification(notification);
    }

    @GetMapping("/ws/test/{userId}")
    @ResponseBody
    public String testNotification(@PathVariable String userId) {
        Notification test = Notification.builder()
                .receiverId(userId)
                .type("DIRECT_MESSAGE")
                .content("This is a test notification.")
                .sourceId("system")
                .build();
        notificationService.sendNotification(test);
        return "Sent!";
    }
}
