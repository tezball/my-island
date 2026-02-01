package com.myisland.api.modules.marketplace.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateOfferRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotBlank(message = "Discount type is required")
        String discountType,

        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0", message = "Discount value must be non-negative")
        BigDecimal discountValue,

        @DecimalMin(value = "0", message = "Minimum purchase must be non-negative")
        BigDecimal minPurchase,

        String termsConditions,

        @NotNull(message = "Valid from date is required")
        LocalDate validFrom,

        @NotNull(message = "Valid until date is required")
        @Future(message = "Valid until date must be in the future")
        LocalDate validUntil,

        @Min(value = 1, message = "Max claims must be at least 1")
        Integer maxClaims,

        String imageUrl
) {}
