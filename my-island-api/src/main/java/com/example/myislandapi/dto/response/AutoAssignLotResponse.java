package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.LotType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AutoAssignLotResponse(
    UUID lotId,
    String lotName,
    LotType type,
    int capacity,
    BigDecimal pricePerNight,
    List<String> images,
    List<String> amenities
) {}
