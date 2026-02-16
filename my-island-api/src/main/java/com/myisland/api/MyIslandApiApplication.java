package com.myisland.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
        org.springframework.ai.model.ollama.autoconfigure.OllamaChatAutoConfiguration.class,
        org.springframework.ai.model.ollama.autoconfigure.OllamaEmbeddingAutoConfiguration.class,
        org.springframework.ai.model.chat.client.autoconfigure.ChatClientAutoConfiguration.class
})
@EnableScheduling
@EnableAsync
public class MyIslandApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyIslandApiApplication.class, args);
    }
}
