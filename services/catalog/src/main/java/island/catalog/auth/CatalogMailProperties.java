package island.catalog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog.mail")
public record CatalogMailProperties(String mode, String from, String publicOrigin) {}
