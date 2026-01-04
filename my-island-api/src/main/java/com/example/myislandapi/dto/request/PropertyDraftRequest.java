package com.example.myislandapi.dto.request;

import com.example.myislandapi.enums.PropertyType;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

/**
 * Request DTO for saving property wizard draft.
 * All fields except propertyType are optional since drafts can be partial.
 */
public record PropertyDraftRequest(
    @NotNull(message = "Property type is required")
    PropertyType propertyType,

    String name,

    String description,

    LocationRequest location,

    List<String> images,

    List<String> facilities,

    List<String> selectedAccommodationTypes,

    Map<String, AccommodationConfigRequest> accommodationConfigs
) {
    public record LocationRequest(
        String address,
        String county,
        Double lat,
        Double lng
    ) {}

    public record AccommodationConfigRequest(
        String type,
        Integer quantity,
        Integer defaultCapacity,
        Double pricePerNight,
        List<String> amenities,
        List<String> customAmenities
    ) {}
}
