package com.DiscordClone.NotificationService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@RedisHash("Notification")
public class Notification {
    @Id
    private String id;
    private String receiverId;
    private String type; // DIRECT_MESSAGE, SERVER_ALERT, MENTION, etc.
    private String content;
    private String sourceId; // channel/server/user
    private String timestamp;

    public String getSourceId() {
        return sourceId;
    }

    public String getContent() {
        return content;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public String getType() {
        return type;
    }
}
