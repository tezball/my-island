package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.LotType;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record UpdateLotRequest(
    @Size(max = 255) String name,
    LotType type,
    @Positive Integer capacity,
    @Positive BigDecimal pricePerNight,
    List<String> images,
    List<String> amenities,
    Boolean available
) {}
