package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
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
        Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0,
                Instant.parse(timestamp).toEpochMilli(), 0,
                amount);

        // 2. Lấy nội dung message từ key riêng cũ hơn timestamp
        // (dùng Instant.parse để so sánh timestamp)
        List<Message> messages = new ArrayList<>();
        if (messageIds != null) {
            for (Object messageId : messageIds) {
                String messageKey = "message:" + messageId;
                Object value = redisTemplate.opsForValue().get(messageKey);

                if (value != null) {
                    System.out.println("Value: " + value);
                    System.out.println("Type: " + value.getClass().getName());

                    if (value instanceof LinkedHashMap) {
                        LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) value;

                        // Map fields from LinkedHashMap to Message
                        String _msgId = (String) map.get("messageId");
                        System.out.println("_msgId: " + _msgId);
                        String _senderId = (String) map.get("senderId");
                        System.out.println("_senderId: " + _senderId);
                        String _serverId = (String) map.get("serverId");
                        System.out.println("_serverId: " + _serverId);
                        String _channelId = (String) map.get("channelId");
                        System.out.println("_channelId: " + _channelId);
                        List<String> _attachments = (List<String>) map.get("attachments");
                        System.out.println("_attachments: " + _attachments);
                        List<String> _mentions = (List<String>) map.get("mentions");
                        System.out.println("_mentions: " + _mentions);
                        LinkedHashMap<String, Object> _contentMap = (LinkedHashMap<String, Object>) map.get("content");
                        System.out.println("_contentMap: " + _contentMap);
                        MessageContent _content = new MessageContent((String) _contentMap.get("text"));
                        System.out.println("_content: " + _content);
                        String _timestamp = (String) map.get("timestamp");
                        System.out.println("_timestamp: " + _timestamp);

                        Message message = new Message(_msgId, _senderId, _serverId, _channelId,  _content, _attachments, _mentions, _timestamp);


                        if (Instant.parse(message.getTimestamp()).isBefore(Instant.parse(timestamp))) {
                            messages.add(message);
                        }
                    }
                } else {
                    System.out.println("Type: null (value is null)");
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
        Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0,
                Instant.parse(timestamp).toEpochMilli());

        // 2. Trả về số lượng ID
        return messageIds != null ? messageIds.size() : 0;
    }

    @Override
    public void deleteByChannel(String serverId, String channelId, String timestamp) {
        // 1. Xóa tất cả message trong sorted set theo channel
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";
        redisTemplate.opsForZSet().removeRangeByScore(zsetKey, 0, Instant.parse(timestamp).toEpochMilli());
    }

    @Override
    public void deleteByServer(String serverId, String timestamp) {
        // 1. Xóa tất cả message trong sorted set theo server
        String zsetKey = "server:" + serverId + ":messages";
        redisTemplate.opsForZSet().removeRangeByScore(zsetKey, 0, Instant.parse(timestamp).toEpochMilli());
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
        Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0,
                Instant.parse(timestamp).toEpochMilli(), 0,
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
