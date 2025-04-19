package com.discord.backend.demomessageddd.interfaceadapter.controller.graphql;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.domain.valueobject.FetchMessage;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.MessageResponse;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.SendMessageRequest;
import com.discord.backend.demomessageddd.application.service.EditMessageUseCase;
import com.discord.backend.demomessageddd.application.service.FetchMessageUseCase;
import com.discord.backend.demomessageddd.application.service.SearchMessageUseCase;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class MessageQueryResolver {

    private final FetchMessageUseCase fetchMessageUseCase;
    private final SearchMessageUseCase searchMessageUseCase;
    private final EditMessageUseCase editMessageUseCase;

    // Socket messaging template for sending messages to clients
    private final SimpMessagingTemplate messagingTemplate;

    public MessageQueryResolver(FetchMessageUseCase fetchMessageUseCase, SearchMessageUseCase searchMessageUseCase,
            EditMessageUseCase editMessageUseCase) {
        this.fetchMessageUseCase = fetchMessageUseCase;
        this.searchMessageUseCase = searchMessageUseCase;
        this.editMessageUseCase = editMessageUseCase;
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
    public FetchMessage fetchMessagesBefore(@Argument String serverId,
            @Argument String channelId,
            @Argument int amount,
            @Argument String timestamp) {
        System.out.println("MessageQueryResolver fetchMessages called with serverId: " + serverId);
        return fetchMessageUseCase.fetchBefore(serverId, channelId, amount, timestamp);
    }

    /**
     * Fetches messages from a specific channel after a given timestamp.
     *
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @param amount    The number of messages to fetch.
     * @param timestamp The timestamp to fetch messages from.
     * @return A list of messages.
     */

    @QueryMapping
    public FetchMessage fetchMessagesAfter(@Argument String serverId,
            @Argument String channelId,
            @Argument int amount,
            @Argument String timestamp) {
        System.out.println("MessageQueryResolver fetchMessages called with serverId: " + serverId);
        return fetchMessageUseCase.fetchAfter(serverId, channelId, amount, timestamp);

    }

    /**
     * Searches for messages in a specific channel.
     *
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @param content   The content to search for.
     * @return A list of messages that match the search criteria.
     */
    @QueryMapping
    public List<Message> searchMessages(
            @Argument String content,
            @Argument String serverId,
            @Argument String channelId) {
        System.out.println("MessageQueryResolver searchMessages called with serverId: " + serverId);
        return searchMessageUseCase.execute(content, serverId, channelId);
    }

    /**
     * Edits a message in a specific channel.
     *
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @param messageId The ID of the message to edit.
     * @param content   The new content for the message.
     * @return The edited message.
     */
    @MutationMapping
    public Message editMessage(@Argument String messageId,
            @Argument String serverId,
            @Argument String channelId,
            @Argument String content) {

        Message message = editMessageUseCase.edit(messageId, serverId, channelId, content);

        MessageResponse messageResponse = new SendMessageRequest(
                message.getId(),
                message.getSenderId(),
                message.getServerId(),
                message.getChannelId(),
                message.getContent().getText(),
                message.getAttachments(),
                message.getMentions(),
                "MESSAGE_UPDATED");

        messagingTemplate.convertAndSend(
                "/topic/server/" + request.serverId() + "/channel/" + request.channelId(),
                messageResponse);

        return message;
    }

    /**
     * Deletes a message in a specific channel.
     *
     * @param serverId  The ID of the server.
     * @param channelId The ID of the channel.
     * @param messageId The ID of the message to delete.
     */
    @MutationMapping
    public void deleteMessage(@Argument String serverId,
            @Argument String channelId,
            @Argument String messageId) {
        System.out.println("MessageQueryResolver deleteMessages called with messageId: " + messageId);

        Message message = ditMessageUseCase.delete(serverId, channelId, messageId);

        MessageResponse messageResponse = new SendMessageRequest(
                message.getId(),
                message.getSenderId(),
                message.getServerId(),
                message.getChannelId(),
                message.getContent().getText(),
                message.getAttachments(),
                message.getMentions(),
                "MESSAGE_DELETED");

        messagingTemplate.convertAndSend(
                "/topic/server/" + request.serverId() + "/channel/" + request.channelId(),
                messageResponse);
    }
}
