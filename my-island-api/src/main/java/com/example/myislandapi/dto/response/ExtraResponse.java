package com.example.myislandapi.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ExtraResponse(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    boolean perNight,
    String imageUrl
) {}
