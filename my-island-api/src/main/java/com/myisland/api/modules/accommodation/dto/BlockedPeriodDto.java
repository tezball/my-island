package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.LotBlockedPeriod;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BlockedPeriodDto(
        Long id,
        Long lotId,
        String lotName,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        LocalDateTime createdAt
) {
    public static BlockedPeriodDto from(LotBlockedPeriod bp) {
        return new BlockedPeriodDto(
                bp.getId(),
                bp.getLot().getId(),
                bp.getLot().getName(),
                bp.getStartDate(),
                bp.getEndDate(),
                bp.getReason(),
                bp.getCreatedAt()
        );
    }
}
