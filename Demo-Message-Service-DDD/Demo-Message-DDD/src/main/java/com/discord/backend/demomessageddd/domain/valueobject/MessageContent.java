package com.discord.backend.demomessageddd.domain.valueobject;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
public class MessageContent {
    private final String text;

    public MessageContent(String text) {

        System.out.println("MessageContent constructor called with text: " + text);

        // Validate the message content
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        if (text.length() > 1000) {
            throw new IllegalArgumentException("Message content is too long");
        }
        this.text = text;
    }

    public String getText() {
        System.out.println("MessageContent getText called");
        return text;
    }

}
