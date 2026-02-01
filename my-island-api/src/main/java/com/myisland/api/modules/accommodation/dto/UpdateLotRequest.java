package com.myisland.api.modules.accommodation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;
import java.util.Set;

public record UpdateLotRequest(
        String name,
        String lotType,
        String description,

        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal pricePerNight,

        @Min(value = 1, message = "Max guests must be at least 1")
        @Max(value = 20, message = "Max guests cannot exceed 20")
        Integer maxGuests,

        Boolean isActive,
        String imageUrl,
        Set<Long> amenityIds
) {}
