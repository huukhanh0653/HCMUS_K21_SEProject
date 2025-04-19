package com.discord.backend.demomessageddd.interfaceadapter.DTO;

import java.util.List;

public record MessageResponse(
        String messageId,
        String senderId,
        String serverId,
        String channelId,
        String content,
        List<String> attachments,
        List<String> mentions,
        String type) {
}
