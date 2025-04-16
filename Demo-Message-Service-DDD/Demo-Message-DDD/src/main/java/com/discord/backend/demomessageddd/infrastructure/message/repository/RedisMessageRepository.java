package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RedisMessageRepository implements CacheMessageRepository {
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisMessageRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void save(Message message) {
        String key;
        // Create a unique key for the message based on its serverId, channelId, and messageId
        // If the message has attachments, include them in the key
        if (message.getAttachments() != null && !message.getAttachments().isEmpty())
            key = "server:" + message.getServerId() + ":channel:" + message.getChannelId() + ":message:" + message.getMessageId() + ":attachments";
        else
            key = "server:" + message.getServerId() + ":channel:" + message.getChannelId() + ":message:" + message.getMessageId();

        // Store the message in Redis with the key
        redisTemplate.opsForValue().set(key, message);
    }
}
