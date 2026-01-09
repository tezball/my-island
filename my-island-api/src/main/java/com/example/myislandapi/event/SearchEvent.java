package com.example.myislandapi.event;

import java.time.LocalDate;
import java.util.UUID;

public record SearchEvent(
        UUID userId,
        String eventType,
        String query,
        String location,
        LocalDate checkIn,
        LocalDate checkOut,
        Integer guests,
        Integer resultsCount,
        UUID campsiteId,
        UUID lotId,
        long timestamp
) {
    public static final String TYPE_SEARCH_PERFORMED = "SEARCH_PERFORMED";
    public static final String TYPE_CAMPSITE_VIEWED = "CAMPSITE_VIEWED";
    public static final String TYPE_LOT_VIEWED = "LOT_VIEWED";
    public static final String TYPE_FILTER_APPLIED = "FILTER_APPLIED";

    public static SearchEvent searchPerformed(UUID userId, String query, String location,
                                              LocalDate checkIn, LocalDate checkOut,
                                              Integer guests, Integer resultsCount) {
        return new SearchEvent(userId, TYPE_SEARCH_PERFORMED, query, location, checkIn, checkOut,
                guests, resultsCount, null, null, System.currentTimeMillis());
    }

    public static SearchEvent campsiteViewed(UUID userId, UUID campsiteId) {
        return new SearchEvent(userId, TYPE_CAMPSITE_VIEWED, null, null, null, null,
                null, null, campsiteId, null, System.currentTimeMillis());
    }

    public static SearchEvent lotViewed(UUID userId, UUID campsiteId, UUID lotId) {
        return new SearchEvent(userId, TYPE_LOT_VIEWED, null, null, null, null,
                null, null, campsiteId, lotId, System.currentTimeMillis());
    }

    public static SearchEvent filterApplied(UUID userId, String filterType) {
        return new SearchEvent(userId, TYPE_FILTER_APPLIED, filterType, null, null, null,
                null, null, null, null, System.currentTimeMillis());
    }
}
