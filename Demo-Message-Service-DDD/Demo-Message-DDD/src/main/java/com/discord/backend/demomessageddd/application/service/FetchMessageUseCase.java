package com.discord.backend.demomessageddd.application.service;

import java.time.Instant;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;
import org.springframework.stereotype.Service;

@Service
public class FetchMessageUseCase {

    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;

    public FetchMessageUseCase(MessageRepository messageRepository,
            CacheMessageRepository cacheMessageRepository) {
        System.out.println("SendMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
    }

    public FetchMessage fetchBefore(String serverId, String channelId, int amount, String timestamp) {
        System.out.println("SendMessageUseCase execute called with senderId: " + serverId);

        long count = cacheMessageRepository.countByChannel(serverId, channelId, timestamp);

        // Fetch from cache first
        List<Message> messages = cacheMessageRepository.findByChannel(serverId, channelId,
                (int) Math.min(amount, count),
                timestamp);
        System.out.println("Messages size: " + messages.size());
        String lastMessageTimestamp = messages.isEmpty() ? timestamp: messages.get(messages.size() -1).getTimestamp() ;
        boolean isExistingMessage = true;

        // If the cache does not have enough messages, fetch from DB
        if (messages.size() < amount) {
            long fetchRemaining = amount - messages.size();
            messages.addAll(messageRepository.findByChannelBeforeTimeStamp(serverId, channelId,
                    (int) Math.min(fetchRemaining, count), lastMessageTimestamp));
            lastMessageTimestamp = messages.get(messages.size() - 1).getTimestamp();

            // Check if there are more messages in the DB than in the cache
            isExistingMessage = messageRepository.countByChannelBeforeTimeStamp(serverId, channelId,
                    lastMessageTimestamp) > amount;
        }

        return new FetchMessage(messages, amount, lastMessageTimestamp, isExistingMessage);
    }

    public FetchMessage fetchAfter(String serverId, String channelId, int amount, String timestamp) {
        System.out.println("SendMessageUseCase execute called with senderId: " + serverId);

        long count = cacheMessageRepository.countByChannel(serverId, channelId, timestamp);

        // Fetch from cache first
        List<Message> messages = cacheMessageRepository.findByChannel(serverId, channelId,
                (int) Math.min(amount, count),
                timestamp);
        System.out.println("Messages size: " + messages.size());
        String lastMessageTimestamp = messages.isEmpty() ? timestamp: messages.get(messages.size() -1).getTimestamp() ;
        boolean isExistingMessage = true;

        // If the cache does not have enough messages, fetch from DB
        if (messages.size() < amount) {
            long fetchRemaining = amount - messages.size();
            messages.addAll(messageRepository.findByChannelBeforeTimeStamp(serverId, channelId,
                    (int) Math.min(fetchRemaining, count), lastMessageTimestamp));
            lastMessageTimestamp = messages.get(messages.size() - 1).getTimestamp();

            // Check if there are more messages in the DB than in the cache
            isExistingMessage = messageRepository.countByChannelBeforeTimeStamp(serverId, channelId,
                    lastMessageTimestamp) > amount;
        }

        return new FetchMessage(messages, amount, lastMessageTimestamp, isExistingMessage);
    }


}
