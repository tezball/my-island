package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.TicketStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record SupportTicketResponse(
    UUID id,
    String subject,
    TicketStatus status,
    Instant createdAt,
    Instant updatedAt,
    List<TicketMessageResponse> messages
) {
    public record TicketMessageResponse(
        UUID id,
        String message,
        boolean fromSupport,
        Instant createdAt
    ) {}
}
