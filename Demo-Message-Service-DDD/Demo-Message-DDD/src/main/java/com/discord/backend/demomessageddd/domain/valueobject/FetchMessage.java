package com.discord.backend.demomessageddd.domain.valueobject;

import java.util.List;

import com.discord.backend.demomessageddd.domain.entity.Message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
public class FetchMessage {
    int amount;
    String lastMessageTimestamp;
    List<Message> messages;
}
