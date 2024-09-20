package com.example.uploading_files.Groq;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class ChatLlamaService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getChatCompletion(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        ObjectNode rootNode = objectMapper.createObjectNode();
        ArrayNode messagesNode = rootNode.putArray("messages");
        ObjectNode messageNode = messagesNode.addObject();
        messageNode.put("role", "user");
        messageNode.put("content", userMessage);
        rootNode.put("model", "llama3-8b-8192");

        String requestBody = rootNode.toString();

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(API_URL, request, String.class);

        return response.getBody();
    }
}