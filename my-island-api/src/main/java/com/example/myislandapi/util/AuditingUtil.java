package com.example.myislandapi.util;

import java.time.Instant;
import java.util.UUID;

/**
 * Utility class for handling audit fields that were previously managed by JPA auditing.
 * Used to set createdAt, updatedAt, and generate UUIDs for new entities.
 */
public final class AuditingUtil {

    private AuditingUtil() {
        // Utility class - no instantiation
    }

    /**
     * Generates a new random UUID for entity primary keys.
     */
    public static UUID generateId() {
        return UUID.randomUUID();
    }

    /**
     * Returns the current instant for timestamp fields.
     */
    public static Instant now() {
        return Instant.now();
    }

    /**
     * Sets up audit fields for a new entity (id, createdAt, updatedAt).
     * Call this before inserting a new record.
     *
     * @param id        the current id (null for new entities)
     * @param createdAt the current createdAt (null for new entities)
     * @return AuditFields containing the values to use
     */
    public static AuditFields prepareForInsert(UUID id, Instant createdAt) {
        Instant now = Instant.now();
        return new AuditFields(
            id != null ? id : UUID.randomUUID(),
            createdAt != null ? createdAt : now,
            now
        );
    }

    /**
     * Sets up audit fields for updating an existing entity.
     * Only updates the updatedAt timestamp.
     *
     * @return the current instant to use for updatedAt
     */
    public static Instant prepareForUpdate() {
        return Instant.now();
    }

    /**
     * Record holding audit field values for insert operations.
     */
    public record AuditFields(UUID id, Instant createdAt, Instant updatedAt) {}
}
