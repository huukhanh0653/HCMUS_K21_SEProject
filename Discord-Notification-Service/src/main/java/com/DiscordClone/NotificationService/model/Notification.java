package com.DiscordClone.NotificationService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@RedisHash("Notification")
public class Notification {
    @Id
    private String id;
    private String serverId;
    private String channelId;
    private String type; // DIRECT_MESSAGE, SERVER_ALERT, MENTION, etc.
    private String content;
    private String senderId; // channel/server/user
    private String timestamp;
    private String messageId;
    private List<String> attachments;

    public String getSourceId() {
        return senderId;
    }

    public String getContent() {
        return content;
    }

    public String getMessageId() {
        return messageId;
    }
}
