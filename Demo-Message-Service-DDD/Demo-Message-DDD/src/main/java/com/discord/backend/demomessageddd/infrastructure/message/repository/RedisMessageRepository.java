package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Repository
public class RedisMessageRepository implements CacheMessageRepository {
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisMessageRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void save(Message message) {
        // 1. Lưu nội dung message vào key riêng và đặt TTL 15 ngày
        String messageKey = "message:" + message.getMessageId();
        redisTemplate.opsForValue().set(messageKey, message, Duration.ofDays(15));


        // 2. Lưu ID vào sorted set theo channel (dùng timestamp làm score)
        String zsetKey = "server:" + message.getServerId() + ":channel:" + message.getChannelId() + ":messages";
        redisTemplate.opsForZSet().add(zsetKey, message.getMessageId(), Instant.parse(message.getTimestamp()).toEpochMilli());
    }

    @Override
    public List<Message> findCache(String serverId, String channelId, long offset, long limit) {
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";

        // Lấy danh sách message ID theo timestamp mới nhất
        Set<Object> messageIds = redisTemplate.opsForZSet()
                .reverseRange(zsetKey, offset, offset + limit - 1);

        List<Message> messages = new ArrayList<>();
        if (messageIds != null) {
            for (Object messageId : messageIds) {
                String messageKey = "message:" + messageId;
                Message message = (Message) redisTemplate.opsForValue().get(messageKey);
                if (message != null) {
                    messages.add(message);
                }
            }
        }

        return messages;
    }

}
