package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.SupplierCategory;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record LocalBusinessResponse(
    UUID id,
    String name,
    SupplierCategory category,
    String description,
    LocationResponse location,
    ContactResponse contact,
    HoursResponse hours,
    List<String> images,
    BigDecimal rating,
    int reviewCount,
    boolean featured
) {
    public record ContactResponse(
        String phone,
        String email,
        String website
    ) {}

    public record HoursResponse(
        String weekday,
        String weekend
    ) {}
}
