package island.catalog.api.dto;

import jakarta.validation.constraints.NotBlank;

public record PasswordLoginRequest(@NotBlank String username, @NotBlank String password) {}
