package com.DiscordClone.NotificationService.kafka;

import com.DiscordClone.NotificationService.model.Notification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaNotificationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.notification.kafka.message-topic}")
    private String messageTopic;

    @Value("${spring.notification.kafka.mention-topic}")
    private String mentionTopic;

    @Value("${spring.notification.kafka.voice-channel-topic}")
    private String voiceChannelTopic;

    public void sendToMessageTopic(Notification notification) {
        sendNotificationToTopic(notification, messageTopic);
    }

    public void sendToMentionTopic(Notification notification) {
        sendNotificationToTopic(notification, mentionTopic);
    }

    public void sendToVoiceChannelTopic(Notification notification) {
        sendNotificationToTopic(notification, voiceChannelTopic);
    }

    private void sendNotificationToTopic(Notification notification, String topic) {
        try {
            String message = objectMapper.writeValueAsString(notification);
            kafkaTemplate.send(topic, message);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize Notification to JSON", e);
        }
    }
}

