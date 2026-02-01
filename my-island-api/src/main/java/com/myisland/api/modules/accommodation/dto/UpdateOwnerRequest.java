package com.myisland.api.modules.accommodation.dto;

import java.util.Set;

public record UpdateOwnerRequest(
        String propertyName,
        String county,
        String town,
        String propertyType,
        String description,
        Double latitude,
        Double longitude,
        String phone,
        String website,
        Set<Long> amenityIds
) {}
