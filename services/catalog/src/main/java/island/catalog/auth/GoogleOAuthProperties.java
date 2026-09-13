package island.catalog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google")
public record GoogleOAuthProperties(String clientId, String clientSecret) {}
