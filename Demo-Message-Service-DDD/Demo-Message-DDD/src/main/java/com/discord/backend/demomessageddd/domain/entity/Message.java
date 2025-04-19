package com.discord.backend.demomessageddd.domain.entity;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a message in the system.
 */
@Data
@ToString
@Document(collection = "messages")
// @JsonTypeName("message")
// @JsonSerialize(using = ToStringSerializer.class)
public class Message {

    private final String messageId;
    private final String senderId;
    private final String serverId;
    private final String channelId;
    private List<String> attachments;
    private List<String> mentions;
    private MessageContent content;
    private String timestamp;
    private String lastEdited;

    public Message(String messageId, String senderId, String serverId,
            String channelId, List<String> attachments,
            List<String> mentions, MessageContent content) {
        if (messageId == null) {
            this.messageId = UUID.randomUUID().toString();
        } else {
            this.messageId = messageId;
        }
        this.senderId = senderId;
        this.channelId = channelId;
        this.serverId = serverId;
        if (attachments == null) {
            this.attachments = List.of();
        } else {
            this.attachments = attachments;
        }
        if (mentions == null) {
            this.mentions = List.of();
        } else {
            this.mentions = mentions;
        }
        this.content = content;
        this.timestamp = Instant.now().toString();
        this.lastEdited = timestamp;
        System.out.println("1 Message constructor called with id:");
    }

    public Message(String senderId, String serverId,
            String channelId, MessageContent content) {

        this.messageId = serverId + Instant.now().toString();
        this.senderId = senderId;
        this.channelId = channelId;
        this.serverId = serverId;
        this.content = content;
        this.timestamp = Instant.now().toString();
        this.lastEdited = timestamp;
        System.out.println("2 Message constructor called with id:");
    }

    @JsonCreator
    public Message(
            @JsonProperty("id") String id,
            @JsonProperty("serverId") String serverId,
            @JsonProperty("channelId") String channelId,
            @JsonProperty("senderId") String senderId,
            @JsonProperty("content") MessageContent content,
            @JsonProperty("attachments") List<String> attachments,
            @JsonProperty("mentions") List<String> mentions,
            @JsonProperty("timestamp") String timestamp) {

        if (id == null) {
            this.messageId = UUID.randomUUID().toString();
        } else {
            this.messageId = id;
        }
        this.serverId = serverId;
        this.channelId = channelId;
        this.senderId = senderId;
        this.content = content;
        this.attachments = attachments;
        this.timestamp = timestamp;
        this.lastEdited = timestamp;
        this.mentions = mentions;

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

    public MessageContent getContent() {
        return content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public List<String> getMentions() {
        return mentions;
    }

    public String getLastEdited() {
        return lastEdited;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public void setContent(MessageContent content) {
        this.content = content;
    }

    public void setMentions(List<String> mentions) {
        this.mentions = mentions;
    }

    public void setLastEdited(String lastEdited) {
        this.lastEdited = lastEdited;
    }

}
