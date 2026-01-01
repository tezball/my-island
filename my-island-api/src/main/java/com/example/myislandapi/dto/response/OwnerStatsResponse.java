package com.example.myislandapi.dto.response;

import java.math.BigDecimal;

public record OwnerStatsResponse(
    int totalBookings,
    int pendingBookings,
    int confirmedBookings,
    int completedBookings,
    BigDecimal totalRevenue,
    BigDecimal thisMonthRevenue,
    double averageRating,
    int totalReviews,
    int totalCampsites,
    int totalLots
) {}
