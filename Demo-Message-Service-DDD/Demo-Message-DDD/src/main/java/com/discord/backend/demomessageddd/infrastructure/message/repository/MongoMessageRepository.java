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
    public Message save(Message message) {
        System.out.println("MongoMessageRepository save called with message: " + message);
        mongoRepository.save(new MessageDocument(message));
        return message;
    }

    // String messageId, String senderId, String serverId, String channelId, String
    // contentText, List<String> attachments

//    @Override
//    public List<Message> findByChannel(String serverId, String channelId) {
//
//        System.out.println("MongoMessageRepository findByChannel called with serverId: " + serverId + ", channelId: " + channelId);
//
//        return mongoRepository.findByServerIdAndChannelId(serverId,channelId).stream()
//                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(), doc.getChannelId(),
//                        new MessageContent(doc.getContent()), doc.getAttachments()))
//                .collect(Collectors.toList());
//    }


}
