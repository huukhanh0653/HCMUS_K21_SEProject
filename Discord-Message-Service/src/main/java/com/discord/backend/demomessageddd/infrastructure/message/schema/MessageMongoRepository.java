package com.discord.backend.demomessageddd.infrastructure.message.schema;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.CountQuery;

import java.util.List;
import java.time.Instant;

public interface MessageMongoRepository extends MongoRepository<MessageDocument, String> {

    // @Query("{ 'serverId': ?0, 'channelId': ?1, 'timestamp': { $lt: ?2 } }")
    List<MessageDocument> findByServerIdAndChannelIdAndTimestampLessThan(String serverId, String channelId,
            Instant timestamp,
            Sort sort);

    // @Query("{ 'serverId': ?0, 'channelId': ?1, 'timestamp': { $gt: ?2 }}")
    List<MessageDocument> findByServerIdAndChannelIdAndTimestampGreaterThan(String serverId, String channelId,
            Instant timestamp,
            Sort sort);

    @Query("{ 'serverId': ?0, 'channelId': ?1, '_id': ?2 }")
    MessageDocument findByServerIdAndChannelIdAndId(String serverId, String channelId, String messageId);

    @CountQuery
    @Query(value = "{ 'serverId': ?0, 'channelId': ?1, 'timestamp': { $lt: ?2 } }", count = true)
    long countByServerIdAndChannelIdAndTimestamp(String serverId, String channelId, Instant timestamp);

    @CountQuery
    @Query(value = "{ 'serverId': ?0, 'channelId': ?1, 'timestamp': { $gt: ?2 } }", count = true)
    long countByServerIdAndChannelIdAfter(String serverId, String channelId, Instant timestamp);

    @Query("{ 'serverId': ?0, 'channelId': ?1 }")
    void deleteByServerIdAndChannelId(String serverId, String channelId);

    @Query("{ 'serverId': ?0 }")
    void deleteByServerId(String serverId);

    @SuppressWarnings("null")
    @Query("{ '_id': ?0, 'serverId': ?1, 'channelId': ?2 }")
    void deleteById(String messageId, String serverId, String channelId);

    @Update("{ '$set': { 'content': ?3, 'lastEdited': ?4 } }")
    @Query("{ '_id': ?0, 'serverId': ?1, 'channelId': ?2 }")
    void editById(String messageId, String serverId, String channelId, String content, String lastEdited);

    // messages collection must have a text index on the content field for this to
    // work
    // command: db.messages.createIndex({ content: "text" })
    @Query("{ '$text': { '$search': ?0 }, 'serverId': ?1, 'channelId': ?2 }")
    List<MessageDocument> searchFullText(String keyword, String serverId, String channelId);
}