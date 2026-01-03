package com.example.myislandapi.dto.response;

import java.math.BigDecimal;

public record OwnerStatsResponse(
    int totalBookings,
    int pendingBookings,
    int confirmedBookings,
    int completedBookings,
    int upcomingBookings,
    BigDecimal totalRevenue,
    BigDecimal thisMonthRevenue,
    BigDecimal lastMonthRevenue,
    double revenueChange,
    double occupancyRate,
    double averageRating,
    int totalReviews,
    int totalCampsites,
    int totalLots
) {}
