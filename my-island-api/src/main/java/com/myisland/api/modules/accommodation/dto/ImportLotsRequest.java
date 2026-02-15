package com.myisland.api.modules.accommodation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ImportLotsRequest(
        @Valid
        @NotEmpty(message = "At least one lot is required")
        List<ImportLotEntry> lots
) {}
