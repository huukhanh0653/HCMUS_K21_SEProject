package com.discord.backend.demomessageddd.infrastructure.config;
import java.util.Base64;

public class RedisKeyUtil {

    // Encode a value (e.g., serverId, channelId, messageId)
    public static String encode(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes());
    }

    // Decode a value
    public static String decode(String encodedValue) {
        return new String(Base64.getDecoder().decode(encodedValue));
    }
}