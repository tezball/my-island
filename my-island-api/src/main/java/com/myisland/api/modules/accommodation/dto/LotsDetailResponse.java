package com.myisland.api.modules.accommodation.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record LotsDetailResponse(
        Summary summary,
        List<LotDetail> lots
) {
    public record Summary(
            int total,
            int available,
            int unavailable,
            Map<String, Integer> byType
    ) {}

    public record LotDetail(
            Long id,
            String name,
            String type,
            BigDecimal pricePerNight,
            boolean isAvailable,
            List<String> amenities
    ) {}
}
