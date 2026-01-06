package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record BookingResponse(
    UUID id,
    BookingStatus status,
    LocalDate checkIn,
    LocalDate checkOut,
    int guests,
    long nights,
    BigDecimal lotPrice,
    BigDecimal extrasPrice,
    BigDecimal serviceFee,
    BigDecimal totalPrice,
    String specialRequests,
    LotSummary lot,
    CampsiteSummary campsite,
    GuestSummary guest,
    List<BookingExtraResponse> extras,
    Instant createdAt
) {
    public record GuestSummary(
        UUID id,
        String name,
        String email,
        String avatarUrl
    ) {}
    public record LotSummary(
        UUID id,
        String name,
        String type,
        List<String> images
    ) {}

    public record CampsiteSummary(
        UUID id,
        String name,
        String county,
        String imageUrl
    ) {}

    public record BookingExtraResponse(
        UUID extraId,
        String name,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
    ) {}
}
