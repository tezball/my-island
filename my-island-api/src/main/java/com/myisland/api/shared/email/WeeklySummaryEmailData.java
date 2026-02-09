package com.myisland.api.shared.email;

import java.math.BigDecimal;
import java.time.LocalDate;

public record WeeklySummaryEmailData(
        String ownerName,
        String propertyName,
        long newBookingsCount,
        BigDecimal totalRevenue,
        long upcomingArrivals,
        long upcomingDepartures,
        LocalDate weekStart,
        LocalDate weekEnd
) {
}
