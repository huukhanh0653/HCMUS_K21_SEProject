package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;

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
        redisTemplate.opsForZSet().add(zsetKey, message.getMessageId(),
                Instant.parse(message.getTimestamp()).toEpochMilli());
    }

    @Override
    public List<Message> findByChannel(String serverId, String channelId, int amount, String timestamp) {

        // 1. Lấy danh sách ID từ sorted set theo channel
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";
        Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0, Long.parseLong(timestamp), 0,
                amount);

        // 2. Lấy nội dung message từ key riêng cũ hơn timestamp
        // (dùng Instant.parse để so sánh timestamp)
        List<Message> messages = new ArrayList<>();
        if (messageIds != null) {
            for (Object messageId : messageIds) {
                String messageKey = "message:" + messageId;
                Message message = (Message) redisTemplate.opsForValue().get(messageKey);
                if (message != null && Instant.parse(message.getTimestamp()).isBefore(Instant.parse(timestamp))) {
                    messages.add(message);
                }
            }
        }

        // 3. Sort lại danh sách message theo timestamp giảm dần
        messages.sort((m1, m2) -> Long.compare(Instant.parse(m2.getTimestamp()).toEpochMilli(),
                Instant.parse(m1.getTimestamp()).toEpochMilli()));

        return messages;
    }

    @Override
    public long countByChannel(String serverId, String channelId, String timestamp) {
        // 1. Lấy danh sách ID từ sorted set theo channel
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";
        Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0, Long.parseLong(timestamp));

        // 2. Trả về số lượng ID
        return messageIds != null ? messageIds.size() : 0;
    }

    @Override
    public void deleteByChannel(String serverId, String channelId, String timestamp) {
        // 1. Xóa tất cả message trong sorted set theo channel
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";
        redisTemplate.opsForZSet().removeRangeByScore(zsetKey, 0, Long.parseLong(timestamp));
    }

    @Override
    public void deleteByServer(String serverId, String timestamp) {
        // 1. Xóa tất cả message trong sorted set theo server
        String zsetKey = "server:" + serverId + ":messages";
        redisTemplate.opsForZSet().removeRangeByScore(zsetKey, 0, Long.parseLong(timestamp));
    }

    @Override
    public void deleteById(String messageId, String timestamp) {
        // 1. Xóa nội dung message theo ID
        String messageKey = "message:" + messageId;
        redisTemplate.delete(messageKey);

        // 2. Xóa ID khỏi sorted set theo channel
        String zsetKey = "server:" + messageId.split(":")[1] + ":channel:" + messageId.split(":")[2] + ":messages";
        redisTemplate.opsForZSet().remove(zsetKey, messageId);
    }

    @Override
    public void editById(String messageId, String timestamp, Message message) {
        // 1. Cập nhật nội dung message theo ID
        String messageKey = "message:" + messageId;
        redisTemplate.opsForValue().set(messageKey, message, Duration.ofDays(15));

        // 2. Cập nhật ID trong sorted set theo channel
        String zsetKey = "server:" + message.getServerId() + ":channel:" + message.getChannelId() + ":messages";
        redisTemplate.opsForZSet().add(zsetKey, messageId,
                Instant.parse(message.getTimestamp()).toEpochMilli());
    }

    @Override
    public List<Message> findByContent(String content, String timestamp, int amount, String serverId,
            String channelId) {
        // 1. Tìm kiếm nội dung message theo content
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";
        Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0, Long.parseLong(timestamp), 0,
                amount);

        // 2. Lấy nội dung message từ key riêng
        List<Message> messages = new ArrayList<>();
        if (messageIds != null) {
            for (Object messageId : messageIds) {
                String messageKey = "message:" + messageId;
                Message message = (Message) redisTemplate.opsForValue().get(messageKey);
                if (message != null && message.getContent().getText().contains(content)) {
                    messages.add(message);
                }
            }
        }

        return messages;
    }
}
