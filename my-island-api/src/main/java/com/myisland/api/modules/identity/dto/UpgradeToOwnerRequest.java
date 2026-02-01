package com.myisland.api.modules.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpgradeToOwnerRequest(
        @NotBlank(message = "Property name is required")
        String propertyName,

        @NotBlank(message = "County is required")
        String county,

        String town,

        @NotBlank(message = "Property type is required")
        String propertyType,

        String description,

        Double latitude,

        Double longitude,

        String phone,

        String website
) {}
