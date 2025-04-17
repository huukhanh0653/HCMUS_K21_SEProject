package com.discord.backend.demomessageddd.domain.valueobject;

import java.time.Instant;
import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;

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
    private List<Message> messages;
    private boolean isExistingMessage;

    public FetchMessage(List<Message> messages, int amount, String lastMessageTimestamp, boolean isExistingMessage) {
        this.messages = messages;
        this.amount = amount;
        this.lastMessageTimestamp = lastMessageTimestamp;
        this.isExistingMessage = isExistingMessage;

        System.out.println("FetchMessage constructor called with messages: " + messages + ", amount: " + amount
                + ", lastMessageTimestamp: " + lastMessageTimestamp + ", isExistingMessage: " + isExistingMessage);

    }

    public FetchMessage() {
        this.messages = null;
        this.amount = 0;
        this.lastMessageTimestamp = Instant.now().toString();
        this.isExistingMessage = true;
        System.out.println("FetchMessage default constructor called with messages: " + messages + ", amount: " + amount
                + ", lastMessageTimestamp: " + lastMessageTimestamp);
    }

}
