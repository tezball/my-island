package com.myisland.api.modules.accommodation.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Set;

public record CreateLotRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Lot type is required")
        String lotType,

        String description,

        @NotNull(message = "Price per night is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal pricePerNight,

        @Min(value = 1, message = "Max guests must be at least 1")
        @Max(value = 20, message = "Max guests cannot exceed 20")
        int maxGuests,

        String imageUrl,

        Set<Long> amenityIds
) {}
