package island.catalog.api.dto;

public record MeResponse(
    String id,
    String email,
    String displayName,
    boolean emailVerified,
    boolean host,
    boolean banned,
    String banReason,
    boolean admin) {}
