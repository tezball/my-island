package island.catalog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog.seed.guest")
public record CatalogSeedProperties(String username, String password, String email) {}
