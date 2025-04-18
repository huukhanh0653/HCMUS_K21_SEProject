package com.discord.backend.demomessageddd.application.service;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.event.MessageEventPublisher;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SendMessageUseCase {
    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;
    private final MessageEventPublisher messageEventPublisher;

    public SendMessageUseCase(MessageRepository messageRepository,
            CacheMessageRepository cacheMessageRepository,
            MessageEventPublisher messageEventPublisher) {
        System.out.println("SendMessageUseCase constructor called with messageRepository: " + messageRepository);
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
        this.messageEventPublisher = messageEventPublisher;
    }

//    /**
//     * Sends a message to a specific channel.
//     *
//     * @param messageId   The ID of the message.
//     * @param senderId    The ID of the sender.
//     * @param serverId    The ID of the server.
//     * @param channelId   The ID of the channel.
//     * @param contentText The text content of the message.
//     * @return The sent message.
//     */
//    public Message execute(String messageId, String senderId, String serverId, String channelId, String contentText) {
//        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
//        return execute(messageId, senderId, serverId, channelId, contentText, null);
//    }

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
    public Message execute(String messageId, String senderId, String serverId, String channelId,
            List<String> attachments, List<String> mentions, String contentText) {

        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);

        MessageContent content = new MessageContent(contentText);
        Message message = new Message(messageId, senderId, serverId, channelId,
                attachments, mentions, content);

        // Save to mongodb
        messageRepository.save(message);
        // Save to redis
        cacheMessageRepository.save(message);
        // Publish to Kafka
        messageEventPublisher.publish(message);

        if (message.getMentions() != null)  {
            for (String mention : message.getMentions()) {
                System.out.println("Mentioned user: " + mention);
            }
        } else {
            System.out.println("No mentions found.");
        }

        return message;
    }

//    /**
//     * Sends a message to a specific channel with attachments.
//     *
//     * @param senderId    The ID of the sender.
//     * @param serverId    The ID of the server.
//     * @param channelId   The ID of the channel.
//     * @param contentText The text content of the message.
//     * @param attachments A list of attachment URLs.
//     * @return The sent message.
//     */
//    public Message execute(String senderId, String serverId, String channelId, String contentText,
//            List<String> attachments, List<String> mentions) {
//        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
//        MessageContent content = new MessageContent(contentText);
//        Message message = new Message(senderId, serverId, channelId,
//                attachments, mentions, content);
//        // Save to mongodb
//        messageRepository.save(message);
//        // Save to redis
//        cacheMessageRepository.save(message);
//        // Publish to Kafka
//        messageEventPublisher.publish(message);
//        return message;
//    }
//
//    /**
//     * Sends a message to a specific channel.
//     *
//     * @param senderId    The ID of the sender.
//     * @param serverId    The ID of the server.
//     * @param channelId   The ID of the channel.
//     * @param contentText The text content of the message.
//     * @return The sent message.
//     */
//
//    public Message execute(String senderId, String serverId, String channelId, String contentText) {
//        System.out.println("SendMessageUseCase execute called with senderId: " + senderId);
//        MessageContent content = new MessageContent(contentText);
//        Message message = new Message(senderId, serverId, channelId, contentText);
//        // Save to mongodb
//        messageRepository.save(message);
//        // Save to redis
//        cacheMessageRepository.save(message);
//        // Publish to Kafka
//        messageEventPublisher.publish(message);
//        return message;
//    }
}
