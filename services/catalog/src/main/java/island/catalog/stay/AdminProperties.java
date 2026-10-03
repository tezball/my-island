package island.catalog.stay;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog.admin")
public record AdminProperties(String googleEmail) {}
