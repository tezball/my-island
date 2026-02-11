package com.myisland.api.modules.booking.dto;

import java.time.LocalDate;

public record ModifyBookingRequest(
        Long lotId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        String reason
) {}
