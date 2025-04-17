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

    @Value("message-topic")
    private String topic;

    public void sendNotificationToKafka(Notification notification) {
        try {
            String message = objectMapper.writeValueAsString(notification);
            kafkaTemplate.send(topic, message); // sends stringified JSON
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize Notification to JSON", e);
        }
    }
}
