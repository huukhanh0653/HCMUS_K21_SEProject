package com.discord.backend.demomessageddd.interfaceadapter.DTO;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
@JsonSerialize
@JsonTypeName("mention")
public class MessageMentionEvent extends Event implements Serializable {
    private String messageId;
    private String senderId;
    private String serverId;
    private String channelId;
    private List<String> mentions;
    private String timestamp;

    public MessageMentionEvent(String messageId, String senderId, String serverId, String channelId,
            List<String> mentions, String timestamp) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.serverId = serverId;
        this.channelId = channelId;
        this.mentions = mentions;
        this.timestamp = timestamp;
    }
}
