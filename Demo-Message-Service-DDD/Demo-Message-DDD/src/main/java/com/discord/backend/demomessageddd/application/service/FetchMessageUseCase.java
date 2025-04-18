package com.discord.backend.demomessageddd.application.service;

import java.time.Instant;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class FetchMessageUseCase {

    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;

    public FetchMessageUseCase(MessageRepository messageRepository,
                               CacheMessageRepository cacheMessageRepository) {
        System.out.println("FetchMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
    }

    public FetchMessage fetchBefore(String serverId, String channelId, int amount, String timestamp) {
        System.out.println("FetchBefore execute called with senderId: " + serverId);

        long count = cacheMessageRepository.countByChannelBefore(serverId, channelId, timestamp);
        System.out.println("FetchBefore execute called with count: " + count);

        if (count == 0) {
            return new FetchMessage(List.of(), 0, timestamp, false);
        }
        List<Message> messages = cacheMessageRepository.findByChannel(serverId, channelId,
                (int) Math.min(amount, count),
                timestamp);

        System.out.println("Messages size: " + messages.size());
        String lastMessageTimestamp = messages.isEmpty() ? timestamp : messages.get(messages.size() - 1).getTimestamp();
        boolean isExistingMessage = true;
        long fetchRemaining;

        if (messages.isEmpty()) {
            fetchRemaining = amount;
        } else {
            fetchRemaining = amount - messages.size();
        }

        // If the cache does not have enough messages, fetch from DB
        if (fetchRemaining > 0) {
            messages.addAll(messageRepository.findByChannelBeforeTimeStamp(serverId, channelId,
                    (int) Math.min(fetchRemaining, count), lastMessageTimestamp));
            System.out.println("Messages size: " + messages.size());
            lastMessageTimestamp = messages.get(messages.size() - 1).getTimestamp();
            System.out.println("Messages size: " + messages.size());
            // Check if there are more messages in the DB than in the cache
            isExistingMessage = messageRepository.countByChannelBeforeTimeStamp(serverId, channelId,
                    lastMessageTimestamp) > amount;
        }

        return new FetchMessage(messages, amount, lastMessageTimestamp, isExistingMessage);
    }

    public FetchMessage fetchAfter(String serverId, String channelId, int amount, String timestamp) {
        System.out.println("SendMessageUseCase execute called with senderId: " + serverId);

        long count = messageRepository.countByChannelAfterTimeStamp(serverId, channelId, timestamp);

        if (count == 0) {
            return new FetchMessage(List.of(), 0, timestamp, false);
        }

        // Fetch from cache first
        List<Message> messages = messageRepository.findByChannelAfterTimeStamp(serverId, channelId,
                (int) Math.min(amount, count),
                timestamp);
        System.out.println("Messages size: " + messages.size());
        String lastMessageTimestamp = messages.isEmpty() ? timestamp : messages.get(messages.size() - 1).getTimestamp();
        boolean isExistingMessage = true;
        if (count > amount) {
        }
        else isExistingMessage = false;

        return new FetchMessage(messages, messages.size(), lastMessageTimestamp, isExistingMessage);
    }


}
