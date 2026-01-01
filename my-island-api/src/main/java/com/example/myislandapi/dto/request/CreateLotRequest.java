package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.LotType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CreateLotRequest(
    @NotNull UUID campsiteId,
    @NotBlank @Size(max = 255) String name,
    @NotNull LotType type,
    @Positive int capacity,
    @NotNull @Positive BigDecimal pricePerNight,
    List<String> images,
    List<String> amenities,
    Boolean available
) {}
