package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.SeasonalPricingRule;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SeasonalPricingRuleDto(
        Long id,
        String lotType,
        String name,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal pricePerNight,
        LocalDateTime createdAt
) {
    public static SeasonalPricingRuleDto from(SeasonalPricingRule rule) {
        return new SeasonalPricingRuleDto(
                rule.getId(),
                rule.getLotType().name(),
                rule.getName(),
                rule.getStartDate(),
                rule.getEndDate(),
                rule.getPricePerNight(),
                rule.getCreatedAt()
        );
    }
}
