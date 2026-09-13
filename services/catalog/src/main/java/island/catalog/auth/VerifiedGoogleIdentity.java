package island.catalog.auth;

public record VerifiedGoogleIdentity(String subject, String email, String displayName) {}
