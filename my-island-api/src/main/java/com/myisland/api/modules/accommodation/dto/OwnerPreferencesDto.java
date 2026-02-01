package com.myisland.api.modules.accommodation.dto;

public record OwnerPreferencesDto(
    boolean emailNotificationsBookings,
    boolean weeklySummaryReports,
    boolean instantBooking,
    boolean allowSameDayBookings,
    boolean requireGuestVerification
) {
    public static OwnerPreferencesDto from(
            boolean emailNotificationsBookings,
            boolean weeklySummaryReports,
            boolean instantBooking,
            boolean allowSameDayBookings,
            boolean requireGuestVerification
    ) {
        return new OwnerPreferencesDto(
                emailNotificationsBookings,
                weeklySummaryReports,
                instantBooking,
                allowSameDayBookings,
                requireGuestVerification
        );
    }
}
