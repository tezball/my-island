package com.myisland.api.modules.accommodation.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateBlockedPeriodRequest(
        @NotNull Long lotId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String reason
) {}
