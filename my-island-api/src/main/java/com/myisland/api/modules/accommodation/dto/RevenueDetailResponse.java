package com.myisland.api.modules.accommodation.dto;

import java.math.BigDecimal;
import java.util.List;

public record RevenueDetailResponse(
        Summary summary,
        List<MonthlyTrend> monthlyTrend,
        List<RevenueByType> byType,
        List<TopLot> topLots
) {
    public record Summary(
            BigDecimal thisMonth,
            BigDecimal lastMonth,
            BigDecimal yearToDate,
            BigDecimal avgBookingValue,
            BigDecimal monthOverMonthChange
    ) {}

    public record MonthlyTrend(
            String month,
            BigDecimal revenue
    ) {}

    public record RevenueByType(
            String type,
            BigDecimal revenue,
            BigDecimal percentage
    ) {}

    public record TopLot(
            String name,
            String type,
            BigDecimal revenue,
            int bookings
    ) {}
}
