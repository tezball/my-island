package com.myisland.api.modules.support.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateTicketStatusRequest(
        @NotBlank String status,
        String priority,
        Long assignedAdminId
) {}
