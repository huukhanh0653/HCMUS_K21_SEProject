package com.discord.backend.demomessageddd.domain.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;

public interface CacheMessageRepository {
    void save(Message message);
}
