package com.DiscordClone.NotificationService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@RedisHash("Notification")
public class Notification implements Serializable {

    @Id
    private String id;

    @Indexed
    private String userId; // Indexed for faster lookups

    private String message;
    private boolean isRead;

    @CreatedDate
    private Instant createdAt; // Auto-populated creation timestamp

    public Notification() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
