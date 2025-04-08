package com.discord.backend.demomessageddd.application.usecase;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SendMessageUseCase {
    private final MessageRepository messageRepository;

    public SendMessageUseCase(MessageRepository messageRepository) {
        System.out.println("SendMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
    }

    /**
     * Sends a message to a specific channel.
     *
     * @param messageId   The ID of the message.
     * @param senderId    The ID of the sender.
     * @param serverId    The ID of the server.
     * @param channelId   The ID of the channel.
     * @param contentText The text content of the message.
     * @return The sent message.
     */
    public Message execute(String messageId, String senderId, String serverId, String channelId, String contentText) {
        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
        return execute(messageId, senderId, serverId, channelId, contentText, null);
    }

    /**
     * Sends a message to a specific channel with attachments.
     *
     * @param messageId   The ID of the message.
     * @param senderId    The ID of the sender.
     * @param serverId    The ID of the server.
     * @param channelId   The ID of the channel.
     * @param contentText The text content of the message.
     * @param attachments A list of attachment URLs.
     * @return The sent message.
     */
    public Message execute(String messageId, String senderId, String serverId, String channelId, String contentText,
                           List<String> attachments) {

        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
        MessageContent content = new MessageContent(contentText);
        Message message = new Message(messageId, senderId, serverId, channelId, content,
                attachments);
        messageRepository.save(message);
        return message;
    }

    /**
     * Sends a message to a specific channel with attachments.
     *
     * @param senderId    The ID of the sender.
     * @param serverId    The ID of the server.
     * @param channelId   The ID of the channel.
     * @param contentText The text content of the message.
     * @param attachments A list of attachment URLs.
     * @return The sent message.
     */
    public Message execute(String senderId, String serverId, String channelId, String contentText,
                           List<String> attachments) {
        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
        return execute(UUID.randomUUID().toString(), senderId, serverId, channelId, contentText, attachments);
    }

    /**
     * Sends a message to a specific channel.
     *
     * @param senderId    The ID of the sender.
     * @param serverId    The ID of the server.
     * @param channelId   The ID of the channel.
     * @param contentText The text content of the message.
     * @return The sent message.
     */

    public Message execute(String senderId, String serverId, String channelId, String contentText) {
        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
        return execute(UUID.randomUUID().toString(), senderId, serverId, channelId, contentText);
    }
}
