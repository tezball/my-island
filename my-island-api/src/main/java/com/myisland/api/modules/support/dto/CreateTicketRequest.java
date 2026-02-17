package com.myisland.api.modules.support.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(
        @NotBlank @Size(max = 255) String subject,
        @NotBlank @Size(max = 5000) String description,
        String category,
        Long relatedBookingId
) {}
