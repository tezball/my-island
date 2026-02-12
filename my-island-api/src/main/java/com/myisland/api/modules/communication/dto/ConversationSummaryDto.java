package com.myisland.api.modules.communication.dto;

import java.time.LocalDateTime;

public record ConversationSummaryDto(
        Long bookingId,
        String lotName,
        String guestName,
        String checkInDate,
        String checkOutDate,
        String lastMessageContent,
        String lastMessageSenderName,
        LocalDateTime lastMessageAt,
        long unreadCount
) {}
