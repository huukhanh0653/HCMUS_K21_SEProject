package com.discord.backend.demomessageddd.application.service;

import java.time.Instant;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;

public class FetchMessageUseCase {

    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;

    public FetchMessageUseCase(MessageRepository messageRepository,
            CacheMessageRepository cacheMessageRepository) {
        System.out.println("SendMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
    }

    public FetchMessage execute(String serverId, String channelId, int amount, String timestamp) {
        System.out.println("SendMessageUseCase execute called with senderId: " + serverId);

        long count = cacheMessageRepository.countByChannel(serverId, channelId, timestamp);

        // Fetch from cache first
        List<Message> messages = cacheMessageRepository.findByChannel(serverId, channelId,
                (int) Math.min(amount, count),
                timestamp);

        String lastMessageTimestamp = messages.get(amount - 1).getTimestamp();

        boolean isExistingMessage = true;

        // If the cache does not have enough messages, fetch from DB
        if (messages.size() < amount) {
            long fetchRemaining = amount - messages.size();
            if (fetchRemaining > 0) {
                messages.addAll(messageRepository.findByChannel(serverId, channelId,
                        (int) Math.min(fetchRemaining, count), lastMessageTimestamp));
                lastMessageTimestamp = messages.get(messages.size() - 1).getTimestamp();
            }

            // Check if there are more messages in the DB than in the cache
            isExistingMessage = messageRepository.countByChannel(serverId, channelId, timestamp) > amount ? true
                    : false;
        }

        FetchMessage fetchMessage = new FetchMessage(messages, amount, timestamp, isExistingMessage);
        return fetchMessage;
    }
}
