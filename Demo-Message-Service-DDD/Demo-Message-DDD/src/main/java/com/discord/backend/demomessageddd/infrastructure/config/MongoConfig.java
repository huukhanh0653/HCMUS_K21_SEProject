package com.discord.backend.demomessageddd.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.discord.backend.demomessageddd.infrastructure.message.schema")
public class MongoConfig {
    // Cấu hình MongoDB nếu cần
}
