package com.myisland.api.modules.admin.dto;

import com.myisland.api.modules.admin.entity.FeatureToggle;

import java.time.LocalDateTime;

public record FeatureToggleDto(
        Long id,
        String name,
        boolean enabled,
        String description,
        String category,
        Long updatedBy,
        LocalDateTime updatedAt
) {
    public static FeatureToggleDto from(FeatureToggle toggle) {
        return new FeatureToggleDto(
                toggle.getId(),
                toggle.getName(),
                toggle.isEnabled(),
                toggle.getDescription(),
                toggle.getCategory(),
                toggle.getUpdatedBy(),
                toggle.getUpdatedAt()
        );
    }
}
