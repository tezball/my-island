package com.myisland.api.modules.booking.dto;

public record ResolveModificationRequest(
    boolean approve,
    String declineReason
) {}
