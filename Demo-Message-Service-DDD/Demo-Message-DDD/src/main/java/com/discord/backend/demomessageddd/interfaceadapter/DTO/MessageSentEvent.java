package com.discord.backend.demomessageddd.interfaceadapter.DTO;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@JsonSerialize
@JsonTypeName("sent")
public class MessageSentEvent extends Event implements Serializable {
    private String messageId;
    private String senderId;
    private String serverId;
    private String channelId;
    private String content;
    private List<String> attachments;
    private String timestamp;

    public MessageSentEvent(String messageId, String senderId, String serverId, String channelId, String content) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.serverId = serverId;
        this.channelId = channelId;
        this.content = content;
        this.attachments = null;
        this.timestamp = null;
    }

    public MessageSentEvent(String messageId, String senderId, String serverId, String channelId, String content, List<String> attachments) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.serverId = serverId;
        this.channelId = channelId;
        this.content = content;
        this.attachments = attachments;
        this.timestamp = null;
    }

    public MessageSentEvent(String messageId, String senderId, String serverId, String channelId, String content, List<String> attachments, String timestamp) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.serverId = serverId;
        this.channelId = channelId;
        this.content = content;
        this.attachments = attachments;
        this.timestamp = timestamp;
    }
}
