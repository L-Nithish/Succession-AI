package com.interviewace.controller;

import com.interviewace.dto.ChatMessage;
import com.interviewace.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class WebSocketChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private AiService aiService;

    // Track the last question asked by the AI per session
    private final ConcurrentHashMap<String, String> sessionLastQuestion = new ConcurrentHashMap<>();

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        
        // If it's a standard user chat message, simulate the AI responding asynchronously
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            CompletableFuture.runAsync(() -> {
                try {
                    // Step 1: Wait 1 second and emit "TYPING" state
                    Thread.sleep(1000);
                    ChatMessage typingMessage = ChatMessage.builder()
                            .sender("AI Interviewer")
                            .content("Interviewer is formulating a follow-up...")
                            .type(ChatMessage.MessageType.TYPING)
                            .build();
                    messagingTemplate.convertAndSend("/topic/public", typingMessage);

                    // Step 2: Generate real AI follow up
                    String originalQuestion = sessionLastQuestion.getOrDefault(sessionId, "General interview question");
                    String aiResponse = aiService.generateFollowUp(originalQuestion, chatMessage.getContent());
                    
                    // Save this response as the new last question for context
                    sessionLastQuestion.put(sessionId, aiResponse);

                    ChatMessage responseMessage = ChatMessage.builder()
                            .sender("AI Interviewer")
                            .content(aiResponse)
                            .type(ChatMessage.MessageType.CHAT)
                            .build();
                    messagingTemplate.convertAndSend("/topic/public", responseMessage);

                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in websocket session attributes
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        }
        return chatMessage;
    }
}
