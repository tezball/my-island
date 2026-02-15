package com.myisland.api.modules.accommodation.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Set;

public record ImportLotEntry(
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

        @Min(value = 1, message = "Minimum stay must be at least 1 night")
        @Max(value = 30, message = "Minimum stay cannot exceed 30 nights")
        int minStay,

        Boolean isActive,

        Set<String> amenities
) {
    public ImportLotEntry {
        if (minStay <= 0) minStay = 1;
        if (isActive == null) isActive = true;
    }
}
