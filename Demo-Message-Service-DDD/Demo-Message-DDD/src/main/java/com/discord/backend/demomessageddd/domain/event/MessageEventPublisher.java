package com.discord.backend.demomessageddd.domain.event;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface MessageEventPublisher {
    void publish(Message message);

    void edit(String messageId, String serverId, String channelId, String content);
    // Add other methods as needed for your event publishing logic

    void mention(String messageId, String senderId, String serverId, String channelId, List<String> mentions, String timestamp);
}