package com.discord.backend.demomessageddd.application.service;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.event.MessageEventPublisher;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;

import java.time.Instant;

import org.springframework.stereotype.Service;

@Service
public class EditMessageUseCase {

    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;
    private final MessageEventPublisher messageEventPublisher;

    public EditMessageUseCase(MessageRepository messageRepository,
            CacheMessageRepository cacheMessageRepository,
            MessageEventPublisher messageEventPublisher) {
        System.out.println("EditMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
        this.messageEventPublisher = messageEventPublisher;
    }

    /**
     * Edits a message in a specific channel.
     *
     * @param messageId   The ID of the message.
     * @param serverId    The ID of the server.
     * @param channelId   The ID of the channel.
     * @param contentText The new text content of the message.
     * @return The edited message.
     */
    public Message edit(String messageId, String serverId, String channelId,
            String contentText) {
        System.out.println("EditMessageUseCase execute called with senderId: ");

        // Validate the message content
        try {
            MessageContent content = new MessageContent(contentText);
        } catch (Exception e) {
            System.out.println("Invalid message content: " + e.getMessage());
            return null; // Handle invalid content
        }
        // Save the message to the database and cache
        messageRepository.editById(messageId, serverId, channelId, contentText);
        cacheMessageRepository.editById(messageId, serverId, channelId, contentText);

        // Publish the message event
        messageEventPublisher.edit(messageId, serverId, channelId, contentText);

        Message message = messageRepository.findById(serverId, channelId, messageId);

        if (message == null) {
            System.out.println("Message not found after edit: " + messageId);
            return null; // Handle message not found
        }

        return message;
    }

    /**
     * Edits a message in a specific channel with attachments.
     *
     * @param messageId The ID of the message.
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @return The edited message.
     */

    public void delete(String serverId, String channelId, String messageId) {
        System.out.println("EditMessageUseCase execute called with senderId: ");

        // Save the message to the database and cache
        messageRepository.deleteById(serverId, channelId, messageId);
        cacheMessageRepository.deleteById(serverId, channelId, messageId);

        // // messageEventPublisher.delete(messageId, serverId, channelId);
        // return messageRepository.findById(serverId, channelId, messageId);
    }

    public void deleteByChannel(String serverId, String channelId) {
        System.out.println("EditMessageUseCase execute called with senderId: ");

        // Save the message to the database and cache
        messageRepository.deleteByChannel(serverId, channelId);
        cacheMessageRepository.deleteByChannel(serverId, channelId, Instant.now());
    }

    public void deleteByServer(String serverId) {
        System.out.println("EditMessageUseCase execute called with senderId: ");

        // Save the message to the database and cache
        messageRepository.deleteByServer(serverId);
        cacheMessageRepository.deleteByServer(serverId, Instant.now());

    }

}
