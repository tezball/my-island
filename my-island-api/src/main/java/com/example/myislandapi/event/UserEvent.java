package com.example.myislandapi.event;

import java.util.UUID;

public record UserEvent(
        UUID userId,
        String eventType,
        String email,
        String ipAddress,
        String userAgent,
        long timestamp
) {
    public static final String TYPE_REGISTERED = "USER_REGISTERED";
    public static final String TYPE_LOGIN = "USER_LOGIN";
    public static final String TYPE_LOGIN_FAILED = "USER_LOGIN_FAILED";
    public static final String TYPE_LOGOUT = "USER_LOGOUT";
    public static final String TYPE_PASSWORD_RESET_REQUESTED = "USER_PASSWORD_RESET_REQUESTED";
    public static final String TYPE_PASSWORD_RESET_COMPLETED = "USER_PASSWORD_RESET_COMPLETED";
    public static final String TYPE_PROFILE_UPDATED = "USER_PROFILE_UPDATED";
    public static final String TYPE_EMAIL_VERIFIED = "USER_EMAIL_VERIFIED";
    public static final String TYPE_DEACTIVATED = "USER_DEACTIVATED";
    public static final String TYPE_ROLE_CHANGED = "USER_ROLE_CHANGED";

    public static UserEvent registered(UUID userId, String email) {
        return new UserEvent(userId, TYPE_REGISTERED, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent login(UUID userId, String email, String ipAddress, String userAgent) {
        return new UserEvent(userId, TYPE_LOGIN, email, ipAddress, userAgent, System.currentTimeMillis());
    }

    public static UserEvent loginFailed(String email, String ipAddress, String userAgent) {
        return new UserEvent(null, TYPE_LOGIN_FAILED, email, ipAddress, userAgent, System.currentTimeMillis());
    }

    public static UserEvent logout(UUID userId, String email) {
        return new UserEvent(userId, TYPE_LOGOUT, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent passwordResetRequested(String email) {
        return new UserEvent(null, TYPE_PASSWORD_RESET_REQUESTED, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent passwordResetCompleted(UUID userId, String email) {
        return new UserEvent(userId, TYPE_PASSWORD_RESET_COMPLETED, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent profileUpdated(UUID userId, String email) {
        return new UserEvent(userId, TYPE_PROFILE_UPDATED, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent emailVerified(UUID userId, String email) {
        return new UserEvent(userId, TYPE_EMAIL_VERIFIED, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent deactivated(UUID userId, String email) {
        return new UserEvent(userId, TYPE_DEACTIVATED, email, null, null, System.currentTimeMillis());
    }

    public static UserEvent roleChanged(UUID userId, String email) {
        return new UserEvent(userId, TYPE_ROLE_CHANGED, email, null, null, System.currentTimeMillis());
    }
}
