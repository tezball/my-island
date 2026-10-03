package island.catalog.api.dto;

import java.math.BigDecimal;

public record StayResponse(
    String id,
    String kind,
    String title,
    String description,
    BigDecimal cost,
    String currency,
    String phone,
    String email,
    String website,
    BigDecimal latitude,
    BigDecimal longitude,
    CountyResponse county,
    String status,
    String review,
    String feedback,
    int imageCount,
    String hostUserId,
    String hostUsername,
    boolean hostBanned,
    String banReason) {}
