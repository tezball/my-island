package com.example.myislandapi.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
    UUID id,
    int rating,
    String comment,
    ReviewCategoriesResponse categories,
    int helpfulCount,
    String ownerResponse,
    UserSummary user,
    Instant createdAt
) {
    public record ReviewCategoriesResponse(
        int cleanliness,
        int location,
        int value,
        int facilities
    ) {}

    public record UserSummary(
        UUID id,
        String name,
        String avatar
    ) {}
}
