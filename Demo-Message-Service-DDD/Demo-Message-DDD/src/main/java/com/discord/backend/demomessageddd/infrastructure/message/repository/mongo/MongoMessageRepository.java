package com.discord.backend.demomessageddd.infrastructure.message.repository.mongo;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;
import com.discord.backend.demomessageddd.infrastructure.message.schema.MessageDocument;
import com.discord.backend.demomessageddd.infrastructure.message.schema.MessageMongoRepository;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class MongoMessageRepository implements MessageRepository {

        private final MessageMongoRepository mongoRepository;

        public MongoMessageRepository(MessageMongoRepository mongoRepository) {
                System.out.println(
                                "MongoMessageRepository constructor called with mongoRepository: " + mongoRepository);
                this.mongoRepository = mongoRepository;
        }

        @Override
        public void save(Message message) {
                System.out.println("MongoMessageRepository save called with message: " + message);
                mongoRepository.save(new MessageDocument(message));
        }

        @Override
        public List<Message> findByChannelBeforeTimeStamp(String serverId, String channelId, long amount,
                        Instant timestamp) {
                System.out.println("MongoMessageRepository findByChannelBefore called with timestamp: " + timestamp);

                List<Message> result = mongoRepository
                                .findByServerIdAndChannelIdAndTimestampLessThan(serverId, channelId, timestamp,
                                                Sort.by(Sort.Direction.DESC,
                                                                "timestamp"))
                                .stream()
                                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(),
                                                doc.getChannelId(), doc.getAttachments(), doc.getMentions(),
                                                new MessageContent(doc.getContent()), doc.getTimestamp()))
                                .collect(Collectors.toList());
                for (Message message : result) {
                        System.out.println(message.getTimestamp().toString());
                }

                return result;
        }

        @Override
        public List<Message> findByChannelAfterTimeStamp(String serverId, String channelId, long amount,
                        Instant timestamp) {
                System.out.println(
                                "MongoMessageRepository findByChannel called with serverId: " + serverId
                                                + ", channelId: " + channelId);
                return mongoRepository.findByServerIdAndChannelIdAndTimestampGreaterThan(serverId, channelId, timestamp,
                                Sort.by(Sort.Direction.ASC,
                                                "timestamp"))
                                .stream()
                                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(),
                                                doc.getChannelId(), doc.getAttachments(), doc.getMentions(),
                                                new MessageContent(doc.getContent()), doc.getTimestamp()))
                                .collect(Collectors.toList());
        }

        @Override
        public Message findById(String serverId, String channelId, String messageId) {
                System.out.println("MongoMessageRepository findById called with serverId: " + serverId + ", channelId: "
                                + channelId + ", messageId: " + messageId);
                MessageDocument doc = mongoRepository.findByServerIdAndChannelIdAndId(serverId, channelId, messageId);
                if (doc != null) {
                        return new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(),
                                        doc.getChannelId(), doc.getAttachments(), doc.getMentions(),
                                        new MessageContent(doc.getContent()), doc.getTimestamp());
                }
                return null;
        }

        @Override
        public long countByChannelBeforeTimeStamp(String serverId, String channelId, Instant timestamp) {
                System.out.println("MongoMessageRepository countByChannel called with serverId: " + serverId
                                + ", channelId: "
                                + channelId);
                return mongoRepository.countByServerIdAndChannelIdAndTimestamp(serverId, channelId, timestamp);
        }

        @Override
        public long countByChannelAfterTimeStamp(String serverId, String channelId, Instant timestamp) {
                System.out.println("MongoMessageRepository countByChannel called with serverId: " + serverId
                                + ", channelId: "
                                + channelId);
                return mongoRepository.countByServerIdAndChannelIdAfter(serverId, channelId, timestamp);
        }

        @Override
        public void deleteByChannel(String serverId, String channelId) {
                System.out.println("MongoMessageRepository deleteByChannel called with serverId: " + serverId
                                + ", channelId: "
                                + channelId);
                mongoRepository.deleteByServerIdAndChannelId(serverId, channelId);
        }

        @Override
        public void deleteByServer(String serverId) {
                System.out.println("MongoMessageRepository deleteByServer called with serverId: " + serverId);
                mongoRepository.deleteByServerId(serverId);
        }

        @Override
        public void deleteById(String serverId, String channelId, String messageId) {
                System.out.println("MongoMessageRepository deleteById called with messageId: " + messageId);
                mongoRepository.deleteById(messageId);
        }

        @Override
        public void editById(String messageId, String serverId, String channelId,
                        String contentText) {
                System.out.println(
                                "MongoMessageRepository editById called with messageId: " + messageId + ", serverId: "
                                                + serverId
                                                + ", channelId: " + channelId + ", contentText: " + contentText);
                mongoRepository.editById(messageId, serverId, channelId, contentText, Instant.now().toString());

        }

        @Override
        public List<Message> searchFullText(String content, String serverId, String channelId) {

                System.out.println(
                                "MongoMessageRepository findByContent called with content: " + content + ", serverId: "
                                                + serverId + ", channelId: " + channelId);
                return mongoRepository.searchFullText(content, serverId, channelId)
                                .stream()
                                .map(doc -> new Message(doc.getMessageId(), doc.getSenderId(), doc.getServerId(),
                                                doc.getChannelId(), doc.getAttachments(), doc.getMentions(),
                                                new MessageContent(doc.getContent()), doc.getTimestamp()))
                                .filter(message -> message.getContent().getText().contains(content))
                                .collect(Collectors.toList());
        }

}
