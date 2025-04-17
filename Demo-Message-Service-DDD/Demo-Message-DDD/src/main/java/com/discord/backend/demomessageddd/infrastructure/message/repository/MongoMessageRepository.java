package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import com.discord.backend.demomessageddd.infrastructure.message.schema.MessageDocument;
import com.discord.backend.demomessageddd.infrastructure.message.schema.MessageMongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class MongoMessageRepository implements MessageRepository {

    private final MessageMongoRepository mongoRepository;

    public MongoMessageRepository(MessageMongoRepository mongoRepository) {
        System.out.println("MongoMessageRepository constructor called with mongoRepository: " + mongoRepository);
        this.mongoRepository = mongoRepository;
    }

    @Override
    public void save(Message message) {
        System.out.println("MongoMessageRepository save called with message: " + message);
        mongoRepository.save(new MessageDocument(message));
    }

    // String messageId, String senderId, String serverId, String channelId, String
    // contentText, List<String> attachments

    @Override
    public List<Message> findByChannel(String serverId, String channelId, long amount, long offset) {
        System.out.println(
                "MongoMessageRepository findByChannel called with serverId: " + serverId + ", channelId: " + channelId);

        return mongoRepository.findByChannel(serverId, channelId)
                .stream()
                .skip(offset) // Apply pagination offset
                .limit(amount) // Apply pagination limit
                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(), doc.getChannelId(),
                        new MessageContent(doc.getContent().getText()), doc.getAttachments()))
                .collect(Collectors.toList());
    }

    @Override
    public long countByChannel(String serverId, String channelId, String timestamp) {
        System.out.println("MongoMessageRepository countByChannel called with serverId: " + serverId + ", channelId: "
                + channelId + ", timestamp: " + timestamp);
        return mongoRepository.countByChannel(serverId, channelId, timestamp);
    }

    @Override
    public void deleteByChannel(String serverId, String channelId, String timestamp) {
        System.out.println("MongoMessageRepository deleteByChannel called with serverId: " + serverId + ", channelId: "
                + channelId + ", timestamp: " + timestamp);
        mongoRepository.deleteByChannel(serverId, channelId, timestamp);
    }

    @Override
    public void deleteByServer(String serverId, String timestamp) {
        System.out.println("MongoMessageRepository deleteByServer called with serverId: " + serverId + ", timestamp: "
                + timestamp);
        mongoRepository.deleteByServer(serverId, timestamp);
    }

    @Override
    public void deleteById(String messageId, String timestamp) {
        System.out.println("MongoMessageRepository deleteById called with messageId: " + messageId + ", timestamp: "
                + timestamp);
        mongoRepository.deleteById(messageId, timestamp);
    }

    @Override
    public void editById(String messageId, String timestamp, String message) {
        System.out.println("MongoMessageRepository editById called with messageId: " + messageId + ", timestamp: "
                + timestamp + ", message: " + message);

        mongoRepository.editById(messageId, timestamp, new MessageContent(message));
    }

    @Override
    public List<Message> findByContent(String content, String timestamp, int amount, String serverId,
            String channelId) {
        System.out.println("MongoMessageRepository findByContent called with content: " + content + ", timestamp: "
                + timestamp + ", amount: " + amount + ", serverId: " + serverId + ", channelId: " + channelId);

        return mongoRepository.findByContent(content, timestamp, amount, serverId, channelId)
                .stream()
                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(), doc.getChannelId(),
                        new MessageContent(doc.getContent().getText()), doc.getAttachments()))
                .collect(Collectors.toList());
    }

}
