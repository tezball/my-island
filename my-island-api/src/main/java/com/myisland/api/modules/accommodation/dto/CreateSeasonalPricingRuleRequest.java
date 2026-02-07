package com.myisland.api.modules.accommodation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateSeasonalPricingRuleRequest(
        @NotBlank String lotType,
        @NotBlank String name,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotNull @Positive BigDecimal pricePerNight
) {}
