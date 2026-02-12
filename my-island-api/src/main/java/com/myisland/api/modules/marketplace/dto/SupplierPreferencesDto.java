package com.myisland.api.modules.marketplace.dto;

public record SupplierPreferencesDto(
    boolean emailNotifications,
    boolean newClaimAlerts,
    boolean weeklyReport,
    boolean marketingEmails
) {
    public static SupplierPreferencesDto from(
            boolean emailNotifications,
            boolean newClaimAlerts,
            boolean weeklyReport,
            boolean marketingEmails
    ) {
        return new SupplierPreferencesDto(
                emailNotifications,
                newClaimAlerts,
                weeklyReport,
                marketingEmails
        );
    }
}
