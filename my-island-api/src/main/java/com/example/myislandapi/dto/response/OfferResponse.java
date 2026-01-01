package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.OfferCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record OfferResponse(
    UUID id,
    String title,
    String description,
    OfferCategory category,
    String imageUrl,
    BigDecimal originalPrice,
    BigDecimal discountPrice,
    Integer discountPercent,
    LocalDate validFrom,
    LocalDate validUntil,
    String promoCode,
    boolean featured,
    UUID campsiteId,
    String campsiteName
) {}
