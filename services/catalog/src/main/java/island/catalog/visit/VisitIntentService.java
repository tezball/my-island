package island.catalog.visit;

import island.catalog.place.BadRequestException;
import island.catalog.place.PlaceJdbc;
import island.catalog.place.PlaceNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitIntentService {

  private static final Logger log = LoggerFactory.getLogger(VisitIntentService.class);

  private final VisitIntentJdbc intents;
  private final PlaceJdbc places;

  public VisitIntentService(VisitIntentJdbc intents, PlaceJdbc places) {
    this.intents = intents;
    this.places = places;
  }

  public Optional<VisitIntent> get(UUID guestId, UUID placeId) {
    return intents.find(guestId, placeId);
  }

  public List<VisitIntent> list(UUID guestId, String mark) {
    if (mark != null && !VisitIntent.MARKS.contains(mark)) {
      throw new BadRequestException("mark must be been, want, or never");
    }
    return intents.listByGuest(guestId, mark);
  }

  @Transactional
  public VisitIntent upsert(UUID guestId, UUID placeId, String mark) {
    if (!VisitIntent.MARKS.contains(mark)) {
      throw new BadRequestException("mark must be been, want, or never");
    }
    if (places.findById(placeId).isEmpty()) {
      throw new PlaceNotFoundException(placeId.toString());
    }
    String oldMark = intents.find(guestId, placeId).map(VisitIntent::mark).orElse(null);
    VisitIntent saved = intents.upsert(guestId, placeId, mark);
    intents.audit(guestId, placeId, oldMark, mark, "upsert");
    log.info(
        "visit_intent upsert guest={} place={} old={} new={}", guestId, placeId, oldMark, mark);
    return saved;
  }

  @Transactional
  public void delete(UUID guestId, UUID placeId) {
    String oldMark = intents.find(guestId, placeId).map(VisitIntent::mark).orElse(null);
    intents.delete(guestId, placeId);
    intents.audit(guestId, placeId, oldMark, null, "delete");
    log.info("visit_intent delete guest={} place={} old={}", guestId, placeId, oldMark);
  }
}
