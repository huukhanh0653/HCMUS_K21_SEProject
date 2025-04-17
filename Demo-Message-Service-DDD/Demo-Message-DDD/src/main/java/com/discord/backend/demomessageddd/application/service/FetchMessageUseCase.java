package com.discord.backend.demomessageddd.application.service;

import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.event.MessageEventPublisher;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;

public class FetchMessageUseCase {

    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;
    private FetchMessage fetchMessage;

    public FetchMessageUseCase(MessageRepository messageRepository,
            CacheMessageRepository cacheMessageRepository), {
        System.out.println("SendMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
        this.fetchMessage = new FetchMessage();
    }

    public List<Message> execute(String serverId, String channelId, int amount, String timestamp) {
        System.out.println("SendMessageUseCase execute called with senderId: " + serverId);
        return messageRepository.findByChannel(serverId, channelId, amount, timestamp);
    }
}
