package com.myisland.moderator.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaConfig {

    // OllamaChatModel is auto-configured by spring-ai-starter-model-ollama from the
    // spring.ai.ollama.* properties in application.yml (base-url, chat.options.model/temperature).
    @Bean
    public ChatClient chatClient(OllamaChatModel chatModel) {
        return ChatClient.builder(chatModel).build();
    }
}
