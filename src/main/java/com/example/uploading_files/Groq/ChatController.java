package com.example.uploading_files.Groq;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    private final ChatLlamaService groqApiService;

    @Autowired
    public ChatController(ChatLlamaService groqApiService) {
        this.groqApiService = groqApiService;
    }


    @PostMapping("/api/chat-completion")
    public String getChatCompletion(@RequestBody String message) {
        return groqApiService.getChatCompletion(message);
    }

}
