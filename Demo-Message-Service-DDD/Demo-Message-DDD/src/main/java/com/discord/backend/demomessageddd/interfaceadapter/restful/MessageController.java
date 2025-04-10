package com.discord.backend.demomessageddd.interfaceadapter.restful;

import com.discord.backend.demomessageddd.application.usecase.SendMessageUseCase;
import com.discord.backend.demomessageddd.domain.entity.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final SendMessageUseCase sendMessageUseCase;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageController(SendMessageUseCase sendMessageUseCase, SimpMessagingTemplate messagingTemplate) {
        this.sendMessageUseCase = sendMessageUseCase;
        this.messagingTemplate = messagingTemplate;
        System.out.println("MessageController constructor called");
    }

    // POST /messages
    // Request body: { "messageId": "123", "senderId": "456", "serverId": "789",
    // "channelId": "101112", "content": "Hello, world!", "attachments": ["url1",
    // "url2"] }
    // -> /topic là destination prefix của SimpMessagingTemplate có nghĩa
    // là gửi broadcast đến tất cả các client đang subscribe đến topic này
    @PostMapping
    public Message sendMessage(@RequestBody SendMessageRequest request) {
        Message message = sendMessageUseCase.execute(request.messageId(), request.senderId(), request.serverId(),
                request.channelId(), request.content(), request.attachments());
        messagingTemplate.convertAndSend(
                "/topic/server/" + request.serverId() + "/channel/" + request.channelId(),
                message);
        System.out.println("Message sent: " + message.toString());
        return message;
    }

}