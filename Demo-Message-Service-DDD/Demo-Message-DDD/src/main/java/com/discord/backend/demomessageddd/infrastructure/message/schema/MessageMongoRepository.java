package com.discord.backend.demomessageddd.infrastructure.message.schema;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageMongoRepository extends MongoRepository<MessageDocument, String> {
}