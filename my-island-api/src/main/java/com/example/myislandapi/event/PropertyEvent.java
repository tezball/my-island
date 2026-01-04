package com.example.myislandapi.event;

import com.example.myislandapi.enums.PropertyType;

import java.time.Instant;
import java.util.UUID;

/**
 * Kafka event for property lifecycle events.
 */
public record PropertyEvent(
    UUID propertyId,
    UUID ownerId,
    PropertyType propertyType,
    PropertyEventType eventType,
    Instant timestamp
) {
    public enum PropertyEventType {
        DRAFT_SAVED,
        CREATED,
        PENDING_REVIEW
    }

    public static PropertyEvent draftSaved(UUID draftId, UUID ownerId, PropertyType propertyType) {
        return new PropertyEvent(draftId, ownerId, propertyType, PropertyEventType.DRAFT_SAVED, Instant.now());
    }

    public static PropertyEvent created(UUID propertyId, UUID ownerId, PropertyType propertyType) {
        return new PropertyEvent(propertyId, ownerId, propertyType, PropertyEventType.CREATED, Instant.now());
    }

    public static PropertyEvent pendingReview(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.PENDING_REVIEW, Instant.now());
    }
}
