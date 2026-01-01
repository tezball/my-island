package com.example.myislandapi.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateReviewRequest(
    @NotNull UUID bookingId,
    @Min(1) @Max(5) int rating,
    @NotBlank String comment,
    ReviewCategoriesRequest categories
) {
    public record ReviewCategoriesRequest(
        @Min(1) @Max(5) int cleanliness,
        @Min(1) @Max(5) int location,
        @Min(1) @Max(5) int value,
        @Min(1) @Max(5) int facilities
    ) {}
}
