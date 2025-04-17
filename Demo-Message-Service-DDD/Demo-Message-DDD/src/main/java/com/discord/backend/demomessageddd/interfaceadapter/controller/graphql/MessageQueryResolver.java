package com.discord.backend.demomessageddd.interfaceadapter.controller.graphql;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;
import com.discord.backend.demomessageddd.application.service.FetchMessageUseCase;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class MessageQueryResolver {

    private final FetchMessageUseCase fetchMessageUseCase;

    public MessageQueryResolver(FetchMessageUseCase fetchMessageUseCase) {
        this.fetchMessageUseCase = fetchMessageUseCase;
    }

    /**
     * Fetches messages from a specific channel.
     *
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @param amount    The number of messages to fetch.
     * @param timestamp The timestamp to fetch messages from.
     * @return A list of messages.
     */
    @QueryMapping
    public FetchMessage fetchMessages(@Argument String serverId,
            @Argument String channelId,
            @Argument int amount,
            @Argument String timestamp) {
        System.out.println("MessageQueryResolver fetchMessages called with serverId: " + serverId);
        return fetchMessageUseCase.execute(serverId, channelId, amount, timestamp);
    }

}
