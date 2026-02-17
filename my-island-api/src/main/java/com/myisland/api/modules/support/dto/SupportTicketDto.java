package com.myisland.api.modules.support.dto;

import java.time.LocalDateTime;

public record SupportTicketDto(
        Long id,
        Long userId,
        String userName,
        String subject,
        String description,
        String category,
        String status,
        String priority,
        Long relatedBookingId,
        Long assignedAdminId,
        String assignedAdminName,
        long messageCount,
        LocalDateTime lastMessageAt,
        LocalDateTime closedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
