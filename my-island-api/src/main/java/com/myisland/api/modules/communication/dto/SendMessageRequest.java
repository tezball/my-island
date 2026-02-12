package com.myisland.api.modules.communication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        @NotBlank(message = "Message content is required")
        @Size(max = 5000, message = "Message must be 5000 characters or less")
        String content
) {}
