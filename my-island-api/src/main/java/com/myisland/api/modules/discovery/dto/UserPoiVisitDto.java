package com.myisland.api.modules.discovery.dto;

import com.myisland.api.modules.discovery.entity.UserPoiVisit;

import java.time.LocalDateTime;

public record UserPoiVisitDto(
        Long id,
        Long poiId,
        String poiName,
        String poiCategory,
        String status,
        LocalDateTime visitedAt,
        String notes
) {
    public static UserPoiVisitDto from(UserPoiVisit visit) {
        return new UserPoiVisitDto(
                visit.getId(),
                visit.getPoi().getId(),
                visit.getPoi().getName(),
                visit.getPoi().getCategory().name(),
                visit.getStatus().name(),
                visit.getVisitedAt(),
                visit.getNotes()
        );
    }
}
