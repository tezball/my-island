package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.LotType;

import java.math.BigDecimal;
import java.util.List;

public record LotTypeAggregationResponse(
    LotType type,
    int totalCount,
    int availableCount,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    int maxCapacity,
    String representativeImage,
    List<String> commonAmenities
) {}
