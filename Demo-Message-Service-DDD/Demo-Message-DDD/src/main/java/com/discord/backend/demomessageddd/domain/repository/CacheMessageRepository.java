package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface CacheMessageRepository {
    void save(Message message);

    List<Message> findByChannel(String serverId, String channelId, int amount, String timestamp);

    long countByChannel(String serverId, String channelId, String timestamp);

    void deleteByChannel(String serverId, String channelId, String timestamp);

    void deleteByServer(String serverId, String timestamp);

    void deleteById(String messageId, String timestamp);

    void editById(String messageId, String timestamp, Message message);

    List<Message> findByContent(String content, String timestamp, int amount, String serverId, String channelId);
}
