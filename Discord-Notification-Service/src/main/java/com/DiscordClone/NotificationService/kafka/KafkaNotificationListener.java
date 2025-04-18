package com.DiscordClone.NotificationService.kafka;

import com.DiscordClone.NotificationService.model.Notification;
import com.DiscordClone.NotificationService.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaNotificationListener {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = {"message-topic", "mention-topic", "voice-channel"}, groupId = "notification-service")
    public void listen(String message) {
        log.info("📨 Received message from Kafka: {}", message);

        try {
            Notification notification = objectMapper.readValue(message, Notification.class);
            notificationService.sendNotification(notification);
        } catch (Exception e) {
            log.error("❌ Failed to parse Kafka message", e);
        }
    }
}
