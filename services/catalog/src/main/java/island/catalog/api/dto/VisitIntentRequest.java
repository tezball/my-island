package island.catalog.api.dto;

import jakarta.validation.constraints.NotBlank;

public record VisitIntentRequest(@NotBlank String mark) {}
