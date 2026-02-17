package com.myisland.api.modules.support.dto;

import java.time.LocalDateTime;

public record SupportTicketMessageDto(
        Long id,
        Long ticketId,
        Long senderId,
        String senderName,
        boolean isAdmin,
        String content,
        LocalDateTime createdAt
) {}
