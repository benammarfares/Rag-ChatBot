package com.example.uploading_files.Lamma;
import com.example.uploading_files.Groq.ChatLlamaService;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.ollama.OllamaChatModel;
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
public class SpringAssistantCommand {

    private final OllamaChatModel chatClient;
    private final VectorStore vectorStore;

    @Value("classpath:/prompts/spring-boot-reference.st")
    private Resource sbPromptTemplate;

    public SpringAssistantCommand(OllamaChatModel chatClient, VectorStore vectorStore, ChatLlamaService chatLlamaService) {
        this.chatClient =  chatClient;
        this.vectorStore = vectorStore;
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping( "q")
    public String question(@RequestParam String message) {
        PromptTemplate promptTemplate = new PromptTemplate(sbPromptTemplate);
        Map<String, Object> promptParameters = new HashMap<>();
        promptParameters.put("input", message);
        promptParameters.put("documents", String.join("\n", findSimilarDocuments(message)));

        return chatClient.call(promptTemplate.create(promptParameters))
                .getResult()
                .getOutput()
                .getContent();
    }

    private List<String> findSimilarDocuments(String message) {
        List<Document> similarDocuments = vectorStore.similaritySearch(SearchRequest.query(message).withTopK(3));
        return similarDocuments.stream().map(Document::getContent).toList();
    }
}
