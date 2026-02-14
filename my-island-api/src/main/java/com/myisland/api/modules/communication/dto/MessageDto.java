package com.myisland.api.modules.communication.dto;

import com.myisland.api.modules.communication.entity.Message;

import java.time.LocalDateTime;

public record MessageDto(
        Long id,
        Long bookingId,
        Long senderId,
        String senderName,
        String content,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static MessageDto from(Message message) {
        return new MessageDto(
                message.getId(),
                message.getBooking().getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getContent(),
                message.isRead(),
                message.getCreatedAt()
        );
    }

    public static MessageDto from(Message message, String displayName) {
        return new MessageDto(
                message.getId(),
                message.getBooking().getId(),
                message.getSender().getId(),
                displayName,
                message.getContent(),
                message.isRead(),
                message.getCreatedAt()
        );
    }
}
