package com.example.uploading_files.groqApi;

import com.example.uploading_files.Groq.ChatLlamaService;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class SpringAssistantApi {

    private final VectorStore vectorStore;
    private final ChatLlamaService chatLlamaService;

    @Value("classpath:/prompts/spring-boot-reference.st")
    private Resource sbPromptTemplate;

    public SpringAssistantApi(VectorStore vectorStore, ChatLlamaService chatLlamaService) {
        this.vectorStore = vectorStore;
        this.chatLlamaService = chatLlamaService;
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("test")
    public String question(@RequestParam String message) {
        PromptTemplate promptTemplate = new PromptTemplate(sbPromptTemplate);
        Map<String, Object> promptParameters = new HashMap<>();
        promptParameters.put("input", message);
        promptParameters.put("documents", String.join("\n", findSimilarDocuments(message)));

        String prompt = String.valueOf(promptTemplate.create(promptParameters));
        return chatLlamaService.getChatCompletion(prompt);
    }



    private List<String> findSimilarDocuments(String message) {
        List<Document> similarDocuments = vectorStore.similaritySearch(SearchRequest.query(message).withTopK(3));
        return similarDocuments.stream().map(Document::getContent).toList();
    }
}