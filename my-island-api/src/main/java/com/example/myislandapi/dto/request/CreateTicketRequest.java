package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(
    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject must be less than 200 characters")
    String subject,

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must be less than 2000 characters")
    String message
) {}
