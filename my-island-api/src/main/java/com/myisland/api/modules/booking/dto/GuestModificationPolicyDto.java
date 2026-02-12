package com.myisland.api.modules.booking.dto;

public record GuestModificationPolicyDto(
    boolean allowed,
    int deadlineDays,
    boolean requiresApproval,
    boolean canModify,
    String cannotModifyReason
) {}
