package com.example.myislandapi.event;

import java.util.UUID;

public record FavoriteEvent(
        UUID userId,
        UUID campsiteId,
        String eventType,
        long timestamp
) {
    public static final String TYPE_ADDED = "FAVORITE_ADDED";
    public static final String TYPE_REMOVED = "FAVORITE_REMOVED";

    public static FavoriteEvent added(UUID userId, UUID campsiteId) {
        return new FavoriteEvent(userId, campsiteId, TYPE_ADDED, System.currentTimeMillis());
    }

    public static FavoriteEvent removed(UUID userId, UUID campsiteId) {
        return new FavoriteEvent(userId, campsiteId, TYPE_REMOVED, System.currentTimeMillis());
    }
}
