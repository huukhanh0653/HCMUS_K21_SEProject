package com.discord.backend.demomessageddd.domain.event;

import com.discord.backend.demomessageddd.domain.entity.Message;

public interface MessageEventPublisher {
    void publish(Message message);
}