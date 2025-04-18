package com.discord.backend.demomessageddd.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.discord.backend.demomessageddd.infrastructure.message.")
@EnableRedisRepositories(basePackages = "com.discord.backend.demomessageddd.infrastructure.message.redis")
public class RepositoryConfig {
}
