package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.Facility;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record CampsiteResponse(
    UUID id,
    String name,
    String description,
    LocationResponse location,
    List<String> images,
    BigDecimal rating,
    int reviewCount,
    BigDecimal priceFrom,
    Set<Facility> facilities,
    boolean featured,
    UUID ownerId
) {}
