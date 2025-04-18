package com.discord.backend.demomessageddd.interfaceadapter.DTO;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import java.io.Serializable;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = MessageSentEvent.class, name = "sent"),
        @JsonSubTypes.Type(value = MessageMentionEvent.class, name = "mention")
})
public abstract class Event implements Serializable {
    // common fields if any
}