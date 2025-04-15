package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RedisMessageRepository implements MessageRepository {
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisMessageRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Message save(Message message) {
        String key = "message:" + message.getMessageId();
        redisTemplate.opsForValue().set(key, message);
        return message;
    }
}

