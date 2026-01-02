package com.example.myislandapi.dto.response;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
    UUID id,
    UUID bookingId,
    UUID senderId,
    String senderName,
    String senderAvatar,
    String content,
    boolean read,
    Instant createdAt
) {}
