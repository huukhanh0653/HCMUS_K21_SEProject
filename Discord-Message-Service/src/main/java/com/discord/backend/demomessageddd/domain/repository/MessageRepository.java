package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;
import java.time.Instant;

public interface MessageRepository {

    void save(Message message);

    List<Message> findByChannelBeforeTimeStamp(String serverId, String channelId, long amount, Instant timestamp);

    List<Message> findByChannelAfterTimeStamp(String serverId, String channelId, long amount, Instant timestamp);

    long countByChannelBeforeTimeStamp(String serverId, String channelId, Instant timestamp);

    Message findById(String serverId, String channelId, String messageId);

    long countByChannelAfterTimeStamp(String serverId, String channelId, Instant timestamp);

    void deleteByChannel(String serverId, String channelId);

    void deleteByServer(String serverId);

    void deleteById(String serverId, String channelId, String messageId);

    void editById(String messageId, String serverId, String channelId,
            String contentText);

    List<Message> searchFullText(String content, String serverId, String channelId);
}
