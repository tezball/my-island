package com.myisland.api.modules.support.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendTicketMessageRequest(
        @NotBlank @Size(max = 5000) String content
) {}
