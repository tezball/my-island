package com.myisland.api.modules.review.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OwnerReviewResponseRequest(
        @NotBlank @Size(max = 2000) String response
) {}
