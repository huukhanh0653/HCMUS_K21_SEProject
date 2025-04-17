package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface CacheMessageRepository {
    void save(Message message);
    List<Message> findByChannel(String serverId, String channelId, int amount, String timestamp);
}
