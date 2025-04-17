package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface MessageRepository {

    void save(Message message);

    List<Message> findByChannelBeforeTimeStamp(String serverId, String channelId, long amount, String timestamp);

    long countByChannelBeforeTimeStamp(String serverId, String channelId, String timestamp);

    void deleteByChannel(String serverId, String channelId);

    void deleteByServer(String serverId);

    void deleteById(String messageId);

    void editById(String messageId, String timestamp, String message);

    List<Message> findByContent(String content, String serverId, String channelId);
}
