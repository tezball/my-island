package com.example.myislandapi.event;

import java.util.UUID;

public record ReviewEvent(
        UUID reviewId,
        UUID userId,
        UUID campsiteId,
        UUID bookingId,
        String eventType,
        Integer rating,
        long timestamp
) {
    public static final String TYPE_CREATED = "REVIEW_CREATED";
    public static final String TYPE_UPDATED = "REVIEW_UPDATED";
    public static final String TYPE_DELETED = "REVIEW_DELETED";
    public static final String TYPE_REPORTED = "REVIEW_REPORTED";
    public static final String TYPE_RESPONSE_ADDED = "REVIEW_RESPONSE_ADDED";

    public static ReviewEvent created(UUID reviewId, UUID userId, UUID campsiteId, UUID bookingId, Integer rating) {
        return new ReviewEvent(reviewId, userId, campsiteId, bookingId, TYPE_CREATED, rating, System.currentTimeMillis());
    }

    public static ReviewEvent updated(UUID reviewId, UUID userId, UUID campsiteId, Integer rating) {
        return new ReviewEvent(reviewId, userId, campsiteId, null, TYPE_UPDATED, rating, System.currentTimeMillis());
    }

    public static ReviewEvent deleted(UUID reviewId, UUID userId, UUID campsiteId) {
        return new ReviewEvent(reviewId, userId, campsiteId, null, TYPE_DELETED, null, System.currentTimeMillis());
    }

    public static ReviewEvent reported(UUID reviewId, UUID reporterId, UUID campsiteId) {
        return new ReviewEvent(reviewId, reporterId, campsiteId, null, TYPE_REPORTED, null, System.currentTimeMillis());
    }

    public static ReviewEvent responseAdded(UUID reviewId, UUID ownerId, UUID campsiteId) {
        return new ReviewEvent(reviewId, ownerId, campsiteId, null, TYPE_RESPONSE_ADDED, null, System.currentTimeMillis());
    }
}
