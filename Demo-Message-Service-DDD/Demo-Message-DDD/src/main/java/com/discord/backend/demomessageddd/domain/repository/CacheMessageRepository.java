package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface CacheMessageRepository {
    void save(Message message);

    List<Message> findByChannel(String serverId, String channelId, int amount, String timestamp);

    List<Message> findByChannelAfter(String serverId, String channelId, int amount, String timestamp);

    long countByChannelBefore(String serverId, String channelId, String timestamp);

    long countByChannelAfter(String serverId, String channelId, String timestamp);

    void deleteByChannel(String serverId, String channelId, String timestamp);

    void deleteByServer(String serverId, String timestamp);

    void deleteById(String serverId, String channelId, String messageId);

    void editById(String messageId, String serverId, String channelId, String newContent);

    /*
     * @deprecated Use {@link #searchFullText(String, String, String)} instead.
     * Service will search in MongoDB only
     */
    @Deprecated
    List<Message> findByContent(String content, String timestamp, int amount, String serverId, String channelId);
}
