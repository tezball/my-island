package island.catalog.api.dto;

public record BannedAccountResponse(String userId, String username, String email, String banReason) {}
