package com.myisland.api.modules.accommodation.dto;

public record OwnerPreferencesDto(
    boolean emailNotificationsBookings,
    boolean weeklySummaryReports,
    boolean instantBooking,
    boolean allowSameDayBookings,
    boolean requireGuestVerification,
    boolean allowGuestModifications,
    int modificationDeadlineDays,
    boolean requireModificationApproval
) {
    public static OwnerPreferencesDto from(
            boolean emailNotificationsBookings,
            boolean weeklySummaryReports,
            boolean instantBooking,
            boolean allowSameDayBookings,
            boolean requireGuestVerification,
            boolean allowGuestModifications,
            int modificationDeadlineDays,
            boolean requireModificationApproval
    ) {
        return new OwnerPreferencesDto(
                emailNotificationsBookings,
                weeklySummaryReports,
                instantBooking,
                allowSameDayBookings,
                requireGuestVerification,
                allowGuestModifications,
                modificationDeadlineDays,
                requireModificationApproval
        );
    }
}
