package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.PropertyType;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for property draft operations.
 */
public record PropertyDraftResponse(
    UUID id,
    PropertyType propertyType,
    Object data,
    Instant createdAt,
    Instant updatedAt
) {}
