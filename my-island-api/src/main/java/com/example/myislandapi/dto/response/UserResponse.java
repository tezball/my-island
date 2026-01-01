package com.example.myislandapi.dto.response;

import com.example.myislandapi.entity.NotificationPreferences;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String name,
        String avatar,
        String phone,
        String bio,
        boolean isOwner,
        boolean isSupplier,
        Instant memberSince,
        NotificationPreferencesResponse notificationPreferences,
        List<LinkedAccountResponse> linkedAccounts
) {
    public record NotificationPreferencesResponse(
            boolean email,
            boolean push,
            boolean sms,
            boolean marketing
    ) {
        public static NotificationPreferencesResponse from(NotificationPreferences prefs) {
            return new NotificationPreferencesResponse(
                    prefs.isEmail(),
                    prefs.isPush(),
                    prefs.isSms(),
                    prefs.isMarketing()
            );
        }
    }

    public record LinkedAccountResponse(
            String provider,
            String email,
            boolean connected
    ) {}
}
