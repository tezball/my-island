package island.catalog.auth;

import java.util.UUID;

public record AppUser(UUID id, String email, String displayName) {}
