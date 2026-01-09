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
        PENDING_REVIEW,
        UPDATED,
        DELETED,
        PUBLISHED,
        UNPUBLISHED,
        FEATURED,
        LOT_CREATED,
        LOT_UPDATED,
        LOT_DELETED,
        LOT_AVAILABILITY_CHANGED,
        PRICING_UPDATED,
        IMAGES_UPLOADED
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

    public static PropertyEvent updated(UUID propertyId, UUID ownerId, PropertyType propertyType) {
        return new PropertyEvent(propertyId, ownerId, propertyType, PropertyEventType.UPDATED, Instant.now());
    }

    public static PropertyEvent deleted(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.DELETED, Instant.now());
    }

    public static PropertyEvent published(UUID propertyId, UUID ownerId, PropertyType propertyType) {
        return new PropertyEvent(propertyId, ownerId, propertyType, PropertyEventType.PUBLISHED, Instant.now());
    }

    public static PropertyEvent unpublished(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.UNPUBLISHED, Instant.now());
    }

    public static PropertyEvent featured(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.FEATURED, Instant.now());
    }

    public static PropertyEvent lotCreated(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.LOT_CREATED, Instant.now());
    }

    public static PropertyEvent lotUpdated(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.LOT_UPDATED, Instant.now());
    }

    public static PropertyEvent lotDeleted(UUID propertyId, UUID ownerId) {
        return new PropertyEvent(propertyId, ownerId, null, PropertyEventType.LOT_DELETED, Instant.now());
    }
}
