package com.myisland.api.modules.booking.dto;

import java.time.LocalDate;

public record GuestModifyBookingRequest(
    Long lotId,
    LocalDate checkInDate,
    LocalDate checkOutDate,
    Boolean wantsPower,
    String reason
) {}
