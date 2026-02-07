package com.myisland.api.modules.review.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateReviewRequest(
        @NotNull Long bookingId,
        @NotNull @DecimalMin("1.0") @DecimalMax("5.0") BigDecimal rating,
        @NotBlank @Size(min = 10, max = 2000) String comment
) {}
