package com.discord.backend.demomessageddd.interfaceadapter.controller.graphql;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.repository.CacheMessageRepository;
import com.discord.backend.demomessageddd.domain.repository.MessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class MessageQueryResolver {

    private final MessageRepository messageRepository;
    private final CacheMessageRepository cacheMessageRepository;

    public MessageQueryResolver(MessageRepository messageRepository, CacheMessageRepository cacheMessageRepository) {
        this.messageRepository = messageRepository;
        this.cacheMessageRepository = cacheMessageRepository;
    }

    @QueryMapping
    public List<Message> findByServerIdAndChannelIdAndTimestampBefore(@Argument String serverId, @Argument String channelId,
                                     @Argument long offset, @Argument long limit) {
        System.out.println("MessageQueryResolver messages called with serverId: " + serverId);
        Pageable pageable = PageRequest.of((int) offset, (int) limit); // Chuyển offset và limit thành Pageable
        return messageRepository.findByServerIdAndChannelIdAndTimestampBefore(serverId, channelId, offset, pageable);
    }

}
