package com.discord.backend.demomessageddd.infrastructure.message.repository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import com.discord.backend.demomessageddd.infrastructure.message.schema.MessageDocument;
import com.discord.backend.demomessageddd.infrastructure.message.schema.MessageMongoRepository;
import org.springframework.stereotype.Repository;

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
    public List<Message> findByChannelBeforeTimeStamp(String serverId, String channelId, long amount,
                                                      String timestamp) {
        System.out.println(
                "MongoMessageRepository findByChannel called with serverId: " + serverId + ", channelId: " + channelId);

        return mongoRepository.findByServerIdAndChannelId(serverId, channelId, timestamp)
                .stream()
                .limit(amount) // Apply pagination limit
                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(),
                        doc.getChannelId(), doc.getAttachments(), doc.getMentions(), new MessageContent(doc.getContent())))
                .collect(Collectors.toList());
    }

    @Override
    public long countByChannelBeforeTimeStamp(String serverId, String channelId, String timestamp) {
        System.out.println("MongoMessageRepository countByChannel called with serverId: " + serverId + ", channelId: "
                + channelId);
        return mongoRepository.countByServerIdAndChannelIdAndTimestamp(serverId, channelId, timestamp);
    }

    @Override
    public void deleteByChannel(String serverId, String channelId) {
        System.out.println("MongoMessageRepository deleteByChannel called with serverId: " + serverId + ", channelId: "
                + channelId);
        mongoRepository.deleteByServerIdAndChannelId(serverId, channelId);
    }

    @Override
    public void deleteByServer(String serverId) {
        System.out.println("MongoMessageRepository deleteByServer called with serverId: " + serverId);
        mongoRepository.deleteByServerId(serverId);
    }

    @Override
    public void deleteById(String messageId) {
        System.out.println("MongoMessageRepository deleteById called with messageId: " + messageId);
        mongoRepository.deleteById(messageId);
    }

    @Override
    public void editById(String messageId, String message, String timestamp) {

        System.out.println(
                "MongoMessageRepository editById called with messageId: " + messageId + ", message: " + message);

        mongoRepository.editById(messageId, timestamp, new MessageContent(message).getText());
    }

    @Override
    public List<Message> findByContent(String content, String serverId, String channelId) {

        System.out.println("MongoMessageRepository findByContent called with content: " + content + ", serverId: "
                + serverId + ", channelId: " + channelId);
        return mongoRepository.findByContent(content, serverId, channelId)
                .stream()
                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(),
                        doc.getChannelId(), doc.getAttachments(), doc.getMentions(), new MessageContent(doc.getContent())))
                .collect(Collectors.toList());
    }

}
