package com.example.myislandapi.dto.response;

import com.example.myislandapi.enums.SupplierCategory;

import java.util.UUID;

public record LocalBusinessMapMarker(
    UUID id,
    String name,
    double lat,
    double lng,
    SupplierCategory category
) {}
