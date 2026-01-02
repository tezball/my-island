package com.example.myislandapi.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record RevenueDataResponse(
    List<MonthlyRevenue> monthlyData
) {
    public record MonthlyRevenue(
        String month,
        BigDecimal revenue,
        int bookings
    ) {}
}
