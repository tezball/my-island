package island.catalog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog.auth.google")
public record CatalogAuthProperties(boolean stubEnabled) {}
