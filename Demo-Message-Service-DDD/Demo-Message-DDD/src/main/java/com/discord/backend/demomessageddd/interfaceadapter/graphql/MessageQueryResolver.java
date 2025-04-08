package com.discord.backend.demomessageddd.interfaceadapter.graphql;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class MessageQueryResolver {

    private final MessageRepository messageRepository;

    public MessageQueryResolver(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @QueryMapping
    public List<Message> messagesByChannel(@Argument String serverId, @Argument String channelId) {
        return messageRepository.findByChannel(serverId, channelId);
    }
}
