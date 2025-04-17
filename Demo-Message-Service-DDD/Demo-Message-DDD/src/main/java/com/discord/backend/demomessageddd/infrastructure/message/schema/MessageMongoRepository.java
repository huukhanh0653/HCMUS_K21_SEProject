package com.discord.backend.demomessageddd.infrastructure.message.schema;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.discord.backend.demomessageddd.domain.entity.Message;

import java.util.List;

public interface MessageMongoRepository extends MongoRepository<MessageDocument, String> {

    @Query("{ 'serverId': ?0, 'channelId': ?1, 'timestamp': { $lt: ?2 } }")
    List<MessageDocument> findByServerIdAndChannelId(String serverId, String channelId, String timestamp);

    @Query(value = "{ 'serverId': ?0, 'channelId': ?1, 'timestamp': { $lt: ?2 } }", count = true)
    long countByServerIdAndChannelIdAndTimestamp(String serverId, String channelId, String timestamp);

    @Query("{ 'serverId': ?0, 'channelId': ?1 }")
    void deleteByServerIdAndChannelId(String serverId, String channelId);

    @Query("{ 'serverId': ?0 }")
    void deleteByServerId(String serverId);

    @SuppressWarnings("null")
    @Query("{ '_id': ?0 }")
    void deleteById(String messageId);

    @Query("{ '_id': ?0, 'timestamp': { $lt: ?1 } }")
    void editById(String messageId, String timestamp, String message);

    @Query("{ 'content': ?0, 'serverId': ?1, 'channelId': ?2 }")
    List<MessageDocument> findByContent(String content, String serverId, String channelId);
}