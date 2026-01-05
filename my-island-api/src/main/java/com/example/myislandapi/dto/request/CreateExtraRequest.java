package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateExtraRequest(
        @NotNull(message = "Campsite ID is required")
        UUID campsiteId,

        @NotBlank(message = "Name is required")
        @Size(max = 255, message = "Name must be at most 255 characters")
        String name,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal price,

        boolean perNight,

        String imageUrl,

        Boolean available
) {
    public CreateExtraRequest {
        // Default available to true if not specified
        if (available == null) {
            available = true;
        }
    }
}
