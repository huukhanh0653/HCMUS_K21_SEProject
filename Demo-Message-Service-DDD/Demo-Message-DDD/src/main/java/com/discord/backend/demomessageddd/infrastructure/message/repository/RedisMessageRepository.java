package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;

import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import com.discord.backend.demomessageddd.infrastructure.config.RedisKeyUtil;
import org.springframework.data.redis.connection.RedisStringCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.types.Expiration;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Repository
@RedisHash(value = "message", timeToLive = 1296000) // 15 days in seconds
public class RedisMessageRepository implements CacheMessageRepository {
    private final RedisTemplate<String, Object> redisTemplate;

    private static Message mapToMessage(LinkedHashMap<String, Object> map) {
        String messageId = (String) map.get("messageId");
        String senderId = (String) map.get("senderId");
        String serverId = (String) map.get("serverId");
        String channelId = (String) map.get("channelId");
        List<String> attachments = (List<String>) map.get("attachments");
        List<String> mentions = (List<String>) map.get("mentions");
        LinkedHashMap<String, Object> contentMap = (LinkedHashMap<String, Object>) map.get("content");
        MessageContent content = new MessageContent((String) contentMap.get("text"));
        String timestamp = (String) map.get("timestamp");

        return new Message(messageId, senderId, serverId, channelId, content, attachments, mentions, timestamp);
    }

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

        System.out.println("find by " + serverId + " by " + channelId + " by " + timestamp);

        try {
            // Validate input parameters
            if (serverId == null || channelId == null) {
                throw new IllegalArgumentException("Server ID and Channel ID cannot be null");
            }
            if (timestamp == null) {
                throw new IllegalArgumentException("Timestamp cannot be null");
            }

            // 1. Construct the Redis key
            String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";

            // 2. Retrieve message IDs from the sorted set
            long offset = 0; // Start from the beginning
            Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0,
                    Instant.parse(timestamp).toEpochMilli(), offset, amount);

            // 3. Retrieve message content from individual keys
            List<Message> messages = new ArrayList<>();
            if (messageIds != null) {
                for (Object messageId : messageIds) {
                    String messageKey = "message:" + messageId;
                    Object value = redisTemplate.opsForValue().get(messageKey);
                    if (value != null && value instanceof Message message) {
                        if (Instant.parse(message.getTimestamp()).isBefore(Instant.parse(timestamp))) {
                            messages.add(message);
                        }
                    }
                }
            }

            // 4. Sort messages by timestamp in descending order
            messages.sort((m1, m2) -> Long.compare(Instant.parse(m2.getTimestamp()).toEpochMilli(),
                    Instant.parse(m1.getTimestamp()).toEpochMilli()));
            return messages;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Message> findByChannelAfter(String serverId, String channelId, int amount, String timestamp) {
        try {
            // Validate input parameters
            if (serverId == null || channelId == null || timestamp == null) {
                throw new IllegalArgumentException("Server ID, Channel ID, and Timestamp cannot be null");
            }

            // 1. Construct the Redis key
            String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";

            // 2. Retrieve message IDs from the sorted set
            long offset = 0; // Start from the beginning
            long count = amount; // Limit the number of results
            Set<Object> messageIds = redisTemplate.opsForZSet().rangeByScore(zsetKey, 0,
                    Instant.parse(timestamp).toEpochMilli(), offset, count);

            // 3. Retrieve message content from individual keys
            List<Message> messages = new ArrayList<>();
            if (messageIds != null) {
                for (Object messageId : messageIds) {
                    String messageKey = "message:" + messageId;
                    Object value = redisTemplate.opsForValue().get(messageKey);

                    if (value != null) {
                        System.out.println("Value: " + value);
                        System.out.println("Type: " + value.getClass().getName());

                        if (value != null && value instanceof Message message) {
                            if (Instant.parse(message.getTimestamp()).isAfter(Instant.parse(timestamp))) {
                                messages.add(message);
                            }
                        }
                    } else {
                        System.out.println("Type: null (value is null)");
                    }
                }
            }

            // 4. Sort messages by timestamp in descending order
            messages.sort((m1, m2) -> Long.compare(Instant.parse(m2.getTimestamp()).toEpochMilli(),
                    Instant.parse(m1.getTimestamp()).toEpochMilli()));

            return messages;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public long countByChannelBefore(String serverId, String channelId, String timestamp) {
        System.out.println("CountByChannel called with serverId: " + serverId + ", channelId: " + channelId
                + ", timestamp: " + timestamp);

        // 1. Construct the Redis key
        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";

        // 2. Parse timestamp into milliseconds (epoch time)
        long maxScore = Instant.parse(timestamp).toEpochMilli();

        // 3. Use ZCOUNT to count messages with score < timestamp
        long count = redisTemplate.opsForZSet().count(zsetKey, 0, maxScore - 1); // < timestamp

        System.out.println("Counted " + count + " messages for key: " + zsetKey + " before timestamp: " + maxScore);

        return count;
    }

    @Override
    public long countByChannelAfter(String serverId, String channelId, String timestamp) {
        System.out.println("Counting NEWER messages with serverId: " + serverId + ", channelId: " + channelId
                + ", timestamp: " + timestamp);

        String zsetKey = "server:" + serverId + ":channel:" + channelId + ":messages";
        long minScore = Instant.parse(timestamp).toEpochMilli();

        // ZCOUNT với min = timestamp + 1 để đảm bảo "mới hơn"
        long count = redisTemplate.opsForZSet().count(zsetKey, minScore + 1, Long.MAX_VALUE);

        System.out.println("Found " + count + " newer messages for key: " + zsetKey);

        return count;
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
    public void deleteById(String serverId, String channelId, String messageId) {
        // 1. Xóa nội dung message theo ID
        String messageKey = "message:" + messageId;
        try {
            redisTemplate.delete(messageKey);
            // 2. Xóa ID khỏi sorted set theo channel
            String zsetKey = "server:" + messageId.split(":")[1] + ":channel:" + messageId.split(":")[2] + ":messages";
            redisTemplate.opsForZSet().remove(zsetKey, messageId);
        } catch (Exception e) {
            System.out.println("Error deleting message: " + e.getMessage());
        }
    }

    @Override
    public void editById(String messageId, String serverId, String channelId, String newContent) {
        String messageKey = "message:" + messageId;

        // 1. Lấy message hiện tại từ Redis
        Object value = redisTemplate.opsForValue().get(messageKey);
        if (value == null) {
            return;
        }

        Message message = mapToMessage((LinkedHashMap<String, Object>) value);
        if (message == null) {
            return;
        }

        // 2. Cập nhật content và lastEdited (timestamp giữ nguyên)
        message.setContent(new MessageContent(newContent));
        message.setLastEdited(Instant.now().toString());

        // 3. Lưu lại message đã chỉnh sửa vào Redis
        redisTemplate.opsForValue().set(messageKey, message);
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
                Object value = redisTemplate.opsForValue().get(messageKey);
                if (value != null && value instanceof Message message
                        && message.getContent().getText().contains(content)) {
                    messages.add(message);
                }
            }
        }

        return messages;
    }
}
