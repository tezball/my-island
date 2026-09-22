package island.catalog.api.dto;

import jakarta.validation.constraints.NotBlank;

public record ForgotRequest(@NotBlank String username) {}
