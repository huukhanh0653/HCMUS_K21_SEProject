package com.discord.backend.demomessageddd.infrastructure.message.schema;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;

@Data
@Document("messages")
public class MessageDocument {
    @Id
    private String messageId;
    private String senderId;
    private String serverId;
    private String channelId;
    private String content;
    private List<String> attachments;
    private String timestamp;

    public MessageDocument() {}

    public MessageDocument(Message message) {
        this.messageId = message.getMessageId();
        this.senderId = message.getSenderId();
        this.serverId = message.getServerId();
        this.channelId = message.getChannelId();
        this.content = message.getContent().getText();
        this.attachments = message.getAttachments();
        this.timestamp = message.getTimestamp();
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

    public String getContent() {
        return content;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public void setContent(MessageContent content) {
        this.content = content.getText();
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Message toDomain() {
        return new Message(
                messageId,
                senderId,
                serverId,
                channelId,
                new MessageContent(content),
                attachments
        );
    }
}
