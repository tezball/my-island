package island.catalog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog.import")
public record CatalogImportProperties(String key) {}
