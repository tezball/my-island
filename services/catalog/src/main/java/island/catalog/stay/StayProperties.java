package island.catalog.stay;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog.stay")
public record StayProperties(
    boolean autoReview,
    long reviewDelayMs,
    long websiteTimeoutMs,
    boolean allowLocalWebsites) {}
