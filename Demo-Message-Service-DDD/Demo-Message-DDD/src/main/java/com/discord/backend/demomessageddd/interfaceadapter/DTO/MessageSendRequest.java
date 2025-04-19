package com.discord.backend.demomessageddd.interfaceadapter.DTO;

import java.util.List;

public record MessageSendRequest(
        String messageId,
        String senderId,
        String serverId,
        String channelId,
        String content,
        List<String> attachments,
        List<String> mentions) {
}
