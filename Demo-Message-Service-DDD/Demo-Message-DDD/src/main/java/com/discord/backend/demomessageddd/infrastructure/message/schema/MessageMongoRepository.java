package com.discord.backend.demomessageddd.infrastructure.message.schema;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface MessageMongoRepository extends MongoRepository<MessageDocument, String> {
    List<MessageDocument> findByChannel(String serverId, String channelId, String senderId, String timestamp);
}