package com.discord.backend.demomessageddd.domain.valueobject;

import java.time.Instant;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.MessageSentEvent;
import com.discord.backend.demomessageddd.interfaceadapter.DTO.MessageFetchRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FetchMessage {

    private int amount;
    private String lastMessageTimestamp;
    private List<MessageFetchRequest> messages;
    private boolean hasMore;

    public FetchMessage(List<Message> messages, int amount, String lastMessageTimestamp, boolean hasMore) {

        this.messages = messages.stream().map(message -> new MessageFetchRequest(message.getMessageId(),
                message.getSenderId(), message.getServerId(), message.getChannelId(), message.getContent().getText(),
                message.getAttachments(), message.getMentions(), message.getTimestamp())).toList();
        this.amount = amount;
        this.lastMessageTimestamp = lastMessageTimestamp;
        this.hasMore = hasMore;

        System.out.println("FetchMessage constructor called with messages: " + messages + ", amount: " + amount
                + ", lastMessageTimestamp: " + lastMessageTimestamp + ", hasMore: " + hasMore);

    }

    public FetchMessage() {
        this.messages = null;
        this.amount = 0;
        this.lastMessageTimestamp = Instant.now().toString();
        this.hasMore = true;
        System.out.println("FetchMessage default constructor called with messages: " + messages + ", amount: " + amount
                + ", lastMessageTimestamp: " + lastMessageTimestamp);
    }

}
