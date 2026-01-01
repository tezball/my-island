package com.example.myislandapi.dto.request;

public record UpdateNotificationPreferencesRequest(
        Boolean email,
        Boolean push,
        Boolean sms,
        Boolean marketing
) {}
