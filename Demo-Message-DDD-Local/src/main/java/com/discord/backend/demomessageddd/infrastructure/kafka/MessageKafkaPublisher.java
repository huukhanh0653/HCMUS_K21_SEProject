package com.discord.backend.demomessageddd.infrastructure.kafka;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.event.MessageEventPublisher;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.MessageSentEvent;
import org.springframework.stereotype.Component;
import org.springframework.kafka.core.KafkaTemplate;

@Component
public class MessageKafkaPublisher implements MessageEventPublisher {

    private final KafkaTemplate<String, MessageSentEvent> kafkaTemplate;

    public MessageKafkaPublisher(KafkaTemplate<String, MessageSentEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publish(Message message) {
        MessageSentEvent event = new MessageSentEvent(
                message.getMessageId(),
                message.getSenderId(),
                message.getServerId(),
                message.getChannelId(),
                message.getContent().getText(),
                message.getAttachments(),
                message.getTimestamp()
        );

        kafkaTemplate.send("message-topic", event);
    }
}

