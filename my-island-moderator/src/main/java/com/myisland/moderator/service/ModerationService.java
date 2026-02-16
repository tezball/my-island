package com.myisland.moderator.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ModerationService {

    private static final Logger log = LoggerFactory.getLogger(ModerationService.class);

    private final ChatClient chatClient;

    private static final String MODERATION_PROMPT = """
            You are a content moderation system for a camping and glamping booking platform in Ireland.
            Analyze the following review and determine if it should be APPROVED or REJECTED.

            A review should be REJECTED if it contains any of the following:
            - Spam or promotional content (URLs, phone numbers for advertising)
            - Offensive, abusive, or hateful language
            - Irrelevant or nonsensical content unrelated to a camping/glamping experience
            - Clearly fake or fabricated reviews
            - Personal attacks or threats

            A review should be APPROVED if it is a genuine customer experience, even if negative or critical.
            Negative reviews that describe real experiences are valid and should be approved.

            Review text: "%s"
            Rating: %s out of 5

            Respond with EXACTLY one line in this format:
            APPROVED|reason
            or
            REJECTED|reason

            Where reason is a brief explanation (under 100 characters).
            """;

    public ModerationService(ChatClient chatClient) {
        this.chatClient = chatClient;
        log.info("ModerationService initialized with Ollama ChatClient");
    }

    public ModerationResult moderate(String comment, BigDecimal rating) {
        try {
            String prompt = String.format(MODERATION_PROMPT, comment, rating.toPlainString());

            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            return parseResponse(response);
        } catch (Exception e) {
            log.error("AI moderation failed, auto-approving review: {}", e.getMessage());
            return new ModerationResult(true, "Auto-approved: AI service unavailable");
        }
    }

    private ModerationResult parseResponse(String response) {
        if (response == null || response.isBlank()) {
            log.warn("Empty response from AI moderation, auto-approving");
            return new ModerationResult(true, "Auto-approved: empty AI response");
        }

        String trimmed = response.trim();
        int pipeIndex = trimmed.indexOf('|');

        if (pipeIndex == -1) {
            log.warn("Unexpected AI response format: {}", trimmed);
            return new ModerationResult(true, "Auto-approved: unexpected AI response format");
        }

        String verdict = trimmed.substring(0, pipeIndex).trim().toUpperCase();
        String reason = trimmed.substring(pipeIndex + 1).trim();

        return switch (verdict) {
            case "APPROVED" -> new ModerationResult(true, reason);
            case "REJECTED" -> new ModerationResult(false, reason);
            default -> {
                log.warn("Unknown moderation verdict: {}", verdict);
                yield new ModerationResult(true, "Auto-approved: unknown verdict from AI");
            }
        };
    }

    public record ModerationResult(boolean approved, String reason) {}
}
