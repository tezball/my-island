package com.myisland.model;

import java.time.LocalDateTime;
import java.util.Map;

public record Notification(
    String id,
    NotificationType type,
    String title,
    String message,
    LocalDateTime timestamp,
    boolean read,
    String actionUrl,
    Map<String, String> meta
) {
    public enum NotificationType {
        booking, offer, review, system, message
    }
}
