package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateExtraRequest(
        @Size(max = 255, message = "Name must be at most 255 characters")
        String name,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description,

        @Positive(message = "Price must be positive")
        BigDecimal price,

        Boolean perNight,

        String imageUrl,

        Boolean available
) {}
