package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageRepository {
    Message save(Message message);
    List<Message> findByChannel(String serverId, String channelId, String senderId, String timestamp);
}

