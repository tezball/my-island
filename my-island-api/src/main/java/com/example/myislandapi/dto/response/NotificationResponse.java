package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
    UUID id,
    NotificationType type,
    String title,
    String message,
    boolean read,
    String actionUrl,
    String relatedId,
    Instant createdAt
) {}
