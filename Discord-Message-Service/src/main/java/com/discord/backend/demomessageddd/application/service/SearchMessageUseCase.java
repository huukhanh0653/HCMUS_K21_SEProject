package com.discord.backend.demomessageddd.application.service;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
/**
 * Use case for searching messages in a specific channel based on content.
 */
public class SearchMessageUseCase {
    private final MessageRepository messageRepository;

    public SearchMessageUseCase(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * Searches for messages in a specific channel based on the content.
     *
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @param content   The content to search for.
     * @return A list of messages that match the search criteria.
     */
    public List<Message> execute(String content, String serverId, String channelId) {
        return messageRepository.searchFullText(content, serverId, channelId);
    }

}
