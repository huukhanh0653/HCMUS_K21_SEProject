package com.discord.backend.demomessageddd.infrastructure.message.schema;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;

@Document(collection = "messages")
public class MessageDocument {
    // Getters and setters omitted for brevity
    @Id
    private String messageId;
    private String senderId;
    private String serverId;
    private String channelId;
    private String content;
    private List<String> attachments;
    private Instant timestamp;

    public MessageDocument() {
        // Default constructor for MongoDB
    }

    public MessageDocument(Message message) {

        System.out.println("MessageDocument constructor called with message: " + message);
        this.serverId = message.getServerId();
        this.attachments = message.getAttachments();
        this.messageId = message.getMessageId();
        this.senderId = message.getSenderId();
        this.channelId = message.getChannelId();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
    }

    public String getContent() {
        return content;
    }

    public String getMessageId() {
        return messageId;
    }

    public String getSenderId() {
        return senderId;
    }

    public String getServerId() {
        return serverId;
    }

    public String getChannelId() {
        return channelId;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

}
