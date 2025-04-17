package com.discord.backend.demomessageddd.infrastructure.message.schema;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.valueobject.MessageContent;

import java.util.List;

public interface MessageMongoRepository extends MongoRepository<MessageDocument, String> {

    List<Message> findByChannel(String serverId, String channelId);

    long countByChannel(String serverId, String channelId, String timestamp);

    void deleteByChannel(String serverId, String channelId, String timestamp);

    void deleteByServer(String serverId, String timestamp);

    void deleteById(String messageId, String timestamp);

    void editById(String messageId, String timestamp, MessageContent message);

    List<Message> findByContent(String content, String timestamp, int amount, String serverId, String channelId);
}