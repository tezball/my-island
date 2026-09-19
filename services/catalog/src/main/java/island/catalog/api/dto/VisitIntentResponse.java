package island.catalog.api.dto;

import java.time.Instant;
import java.util.UUID;

public record VisitIntentResponse(UUID placeId, String mark, Instant updatedAt) {}
