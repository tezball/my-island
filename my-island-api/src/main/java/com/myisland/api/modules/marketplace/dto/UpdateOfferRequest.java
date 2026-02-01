package com.myisland.api.modules.marketplace.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateOfferRequest(
        String title,
        String description,
        String discountType,

        @DecimalMin(value = "0", message = "Discount value must be non-negative")
        BigDecimal discountValue,

        @DecimalMin(value = "0", message = "Minimum purchase must be non-negative")
        BigDecimal minPurchase,

        String termsConditions,
        LocalDate validFrom,
        LocalDate validUntil,

        @Min(value = 1, message = "Max claims must be at least 1")
        Integer maxClaims,

        Boolean isActive,
        String imageUrl
) {}
