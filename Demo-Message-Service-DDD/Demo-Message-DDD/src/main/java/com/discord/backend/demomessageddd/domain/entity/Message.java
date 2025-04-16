package com.discord.backend.demomessageddd.domain.entity;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a message in the system.
 */
@Data
@ToString
@Document(collection = "messages")
//@JsonSerialize(using = ToStringSerializer.class)
public class Message {
    private final String messageId;
    private final String senderId;
    private final String serverId;
    private final String channelId;
    private final List<String> attachments;
    private final MessageContent content;
    private final String timestamp;

    public Message(String messageId, String senderId, String serverId,
                   String channelId, MessageContent content,
                   List<String> attachments) {
        this.senderId = senderId;
        this.channelId = channelId;
        this.serverId = serverId;
        this.messageId = messageId;
        this.attachments = attachments;
        this.content = content;
        this.timestamp = Instant.now().toString();
    }

    public Message(String senderId, String serverId, String channelId, String contentText,
                   List<String> attachments) {
        this(UUID.randomUUID().toString(), senderId, serverId, channelId, new MessageContent(contentText), attachments);
        System.out.println("Message constructor called with senderId: " + senderId);
    }

    public Message(String senderId, String serverId, String channelId, String contentText) {
        this(UUID.randomUUID().toString(), senderId, serverId, channelId, new MessageContent(contentText), null);
        System.out.println("Message constructor called with senderId: " + senderId);
    }

    public Message(String messageId, String senderId, String serverId, String channelId, MessageContent content) {
        this(messageId, senderId, serverId, channelId, content, null);
        System.out.println("Message constructor called with messageId: " + messageId);
    }

    public String getMessageId() { return messageId; }
    public String getSenderId() { return senderId; }
    public String getServerId() { return serverId; }
    public String getChannelId() { return channelId; }
    public List<String> getAttachments() { return attachments; }
    public MessageContent getContent() { return content; }
    public String getTimestamp() { return timestamp; }
}
