package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface MessageRepository {
    Message save(Message message);
    Map<int, String, List<Message>> findByChannel(String serverId, String channelId, int amount, String timestamp);
}
