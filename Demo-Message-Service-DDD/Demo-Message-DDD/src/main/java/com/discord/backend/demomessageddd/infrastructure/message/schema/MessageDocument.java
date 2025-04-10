package com.discord.backend.demomessageddd.infrastructure.message.schema;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import lombok.Getter;

import com.discord.backend.demomessageddd.domain.entity.Message;

@Getter
@Document("messages")
public class MessageDocument {
    @Id
    private String id;
    private String senderId;
    private String serverId;
    private String channelId;
    private String content;
    private List<String> attachments;

    public MessageDocument() {}

    public MessageDocument(Message message) {
        this.id = message.getMessageId();
        this.senderId = message.getSenderId();
        this.serverId = message.getServerId();
        this.channelId = message.getChannelId();
        this.content = message.getContent().getText();
        this.attachments = message.getAttachments();
    }



}
