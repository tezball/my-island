package com.myisland.api.modules.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record UpgradeToSupplierRequest(
        @NotBlank(message = "Business name is required")
        String businessName,

        @NotBlank(message = "Category is required")
        String category,

        String description,

        @NotBlank(message = "County is required")
        String county,

        String town,

        String address,

        String phone,

        String website,

        String logoUrl
) {}
