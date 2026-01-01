package com.example.myislandapi.event;

import com.example.myislandapi.enums.NotificationType;

import java.util.UUID;

public record NotificationEvent(
        UUID userId,
        NotificationType type,
        String title,
        String message,
        UUID referenceId,
        long timestamp
) {
    public static NotificationEvent create(UUID userId, NotificationType type,
                                           String title, String message, UUID referenceId) {
        return new NotificationEvent(userId, type, title, message, referenceId, System.currentTimeMillis());
    }
}
