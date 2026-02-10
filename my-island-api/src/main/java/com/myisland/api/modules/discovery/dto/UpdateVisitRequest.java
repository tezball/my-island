package com.myisland.api.modules.discovery.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateVisitRequest(
        @NotNull Long poiId,
        @NotNull String status,
        String notes
) {}
