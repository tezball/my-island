package island.catalog.visit;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record VisitIntent(UUID guestId, UUID placeId, String mark, Instant updatedAt) {

  public static final Set<String> MARKS = Set.of("been", "want", "never");
}
