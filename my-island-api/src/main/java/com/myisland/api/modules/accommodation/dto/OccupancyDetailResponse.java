package com.myisland.api.modules.accommodation.dto;

import java.math.BigDecimal;
import java.util.List;

public record OccupancyDetailResponse(
        Summary summary,
        List<OccupancyByType> byType,
        List<WeeklyTrend> weeklyTrend,
        List<PeakDay> peakDays
) {
    public record Summary(
            BigDecimal currentRate,
            int totalLots,
            int availableLots,
            int occupiedLots,
            BigDecimal avgStayDuration
    ) {}

    public record OccupancyByType(
            String type,
            int total,
            int occupied,
            BigDecimal rate
    ) {}

    public record WeeklyTrend(
            String day,
            BigDecimal rate
    ) {}

    public record PeakDay(
            String day,
            BigDecimal avgRate
    ) {}
}
