package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;
import java.time.Instant;

public interface CacheMessageRepository {
    void save(Message message);

    List<Message> findByChannelBefore(String serverId, String channelId, int amount, Instant timestamp);

    List<Message> findByChannelAfter(String serverId, String channelId, int amount, Instant timestamp);

    long countByChannelBefore(String serverId, String channelId, Instant timestamp);

    long countByChannelAfter(String serverId, String channelId, Instant timestamp);

    void deleteByChannel(String serverId, String channelId, Instant timestamp);

    void deleteByServer(String serverId, Instant timestamp);

    void deleteById(String serverId, String channelId, String messageId);

    void editById(String messageId, String serverId, String channelId, String newContent);

    /*
     * @deprecated Use {@link #searchFullText(String, String, String)} instead.
     * Service will search in MongoDB only
     */
    @Deprecated
    List<Message> findByContent(String content, Instant timestamp, int amount, String serverId, String channelId);
}
