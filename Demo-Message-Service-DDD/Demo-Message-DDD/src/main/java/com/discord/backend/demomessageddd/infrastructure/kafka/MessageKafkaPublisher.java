package com.discord.backend.demomessageddd.infrastructure.kafka;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.event.MessageEventPublisher;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.Event;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.MessageMentionEvent;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.MessageSentEvent;
import org.springframework.stereotype.Component;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.List;

@Component
public class MessageKafkaPublisher implements MessageEventPublisher {

    private final KafkaTemplate<String, Event> kafkaTemplate;

    public MessageKafkaPublisher(KafkaTemplate<String, Event> kafkaTemplate) {
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
                message.getTimestamp());

        kafkaTemplate.send("message-topic", event);
    }

    @Override
    public void edit(String messageId, String serverId, String channelId, String content) {
        // Implement the edit logic here if needed
    }

    @Override
    public void mention(Message message) {
        // Implement the mention logic here if needed
        MessageMentionEvent event = new MessageMentionEvent(
                message.getMessageId(),
                message.getSenderId(),
                message.getServerId(),
                message.getChannelId(),
                message.getMentions(),
                message.getTimestamp());

        kafkaTemplate.send("mention-topic", event);
    }
}
