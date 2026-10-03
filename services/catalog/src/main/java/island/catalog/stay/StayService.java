package island.catalog.stay;

import island.catalog.api.dto.StayResponse;
import island.catalog.place.BadRequestException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class StayService {

  private static final Logger log = LoggerFactory.getLogger(StayService.class);

  private final StayJdbc stays;
  private final CountyLocator counties;
  private final StayWebsite websites;
  private final StayProperties properties;
  private final StayReviewScheduler scheduler;

  public StayService(
      StayJdbc stays,
      CountyLocator counties,
      StayWebsite websites,
      StayProperties properties,
      @Lazy StayReviewScheduler scheduler) {
    this.stays = stays;
    this.counties = counties;
    this.websites = websites;
    this.properties = properties;
    this.scheduler = scheduler;
  }

  @Transactional
  public StayResponse create(UUID hostUserId, StayWrite write) {
    stays.ensureHost(hostUserId);
    rejectIfBanned(hostUserId);
    UUID id = saveNew(hostUserId, write);
    scheduleAfterCommit(id);
    return stays.require(id);
  }

  @Transactional
  public StayResponse update(UUID hostUserId, UUID stayId, StayWrite write) {
    stays.ensureHost(hostUserId);
    rejectIfBanned(hostUserId);
    StayResponse existing = stays.require(stayId);
    if (!hostUserId.toString().equals(existing.hostUserId())) {
      throw new StayNotFoundException();
    }
    Parsed parsed = parse(write);
    stays.updateSubmitted(
        stayId,
        hostUserId,
        parsed.kind(),
        parsed.title(),
        parsed.description(),
        parsed.cost(),
        parsed.phone(),
        parsed.email(),
        parsed.website(),
        parsed.latitude(),
        parsed.longitude());
    if (!write.keepImages() || !write.images().isEmpty()) {
      stays.replaceImages(stayId, storeImages(write.images()));
    }
    scheduleAfterCommit(stayId);
    return stays.require(stayId);
  }

  @Transactional
  public StayResponse reviewNow(UUID stayId) {
    StayResponse stay = stays.require(stayId);
    UUID hostId = UUID.fromString(stay.hostUserId());
    String countyId = counties.id(stay.latitude().doubleValue(), stay.longitude().doubleValue());
    StayReview.Draft draft =
        new StayReview.Draft(
            stay.kind(),
            stay.title(),
            stay.description(),
            stay.cost() == null ? null : stay.cost().toPlainString(),
            stay.phone(),
            stay.email(),
            stay.website(),
            stay.latitude().doubleValue(),
            stay.longitude().doubleValue(),
            countyId,
            stays.imageBytes(stayId));
    StayReview.Result result =
        StayReview.review(draft, websites::load, properties.allowLocalWebsites());
    if (stays.isBanned(hostId) && "public".equals(result.status())) {
      result =
          StayReview.Result.feedback("This host is banned. The Stay stays hidden.");
    }
    if (result.ban()) {
      stays.ban(hostId, result.banReason());
    }
    stays.saveReview(stayId, countyId, result);
    return stays.require(stayId);
  }

  public StayResponse requireHost(UUID hostUserId, UUID stayId) {
    StayResponse stay = stays.require(stayId);
    if (!hostUserId.toString().equals(stay.hostUserId())) {
      throw new StayNotFoundException();
    }
    return stay;
  }

  public StayResponse requirePublic(UUID stayId) {
    StayResponse stay = stays.require(stayId);
    if (!"public".equals(stay.status()) || stay.hostBanned()) {
      throw new StayNotFoundException();
    }
    return publicView(stay);
  }

  public List<StayResponse> listPublic() {
    return stays.listPublic().stream().map(StayService::publicView).toList();
  }

  public static StayResponse publicView(StayResponse stay) {
    return new StayResponse(
        stay.id(),
        stay.kind(),
        stay.title(),
        stay.description(),
        stay.cost(),
        stay.currency(),
        stay.phone(),
        stay.email(),
        stay.website(),
        stay.latitude(),
        stay.longitude(),
        stay.county(),
        stay.status(),
        null,
        null,
        stay.imageCount(),
        null,
        null,
        false,
        null);
  }

  private UUID saveNew(UUID hostUserId, StayWrite write) {
    Parsed parsed = parse(write);
    UUID id =
        stays.insertSubmitted(
            hostUserId,
            parsed.kind(),
            parsed.title(),
            parsed.description(),
            parsed.cost(),
            parsed.phone(),
            parsed.email(),
            parsed.website(),
            parsed.latitude(),
            parsed.longitude());
    stays.replaceImages(id, storeImages(write.images()));
    return id;
  }

  private void rejectIfBanned(UUID hostUserId) {
    if (stays.isBanned(hostUserId)) {
      throw new HostBannedException(stays.banReason(hostUserId));
    }
  }

  private void scheduleAfterCommit(UUID id) {
    if (!properties.autoReview()) {
      return;
    }
    if (TransactionSynchronizationManager.isSynchronizationActive()) {
      TransactionSynchronizationManager.registerSynchronization(
          new TransactionSynchronization() {
            @Override
            public void afterCommit() {
              scheduler.schedule(id);
            }
          });
    } else {
      scheduler.schedule(id);
    }
  }

  private Parsed parse(StayWrite write) {
    String kind = write.kind() == null ? "" : write.kind().trim();
    if (!StayReview.KINDS.contains(kind)) {
      throw new BadRequestException(
          "Kind has to be campsite, bed and breakfast, apartment, glamping, or lodge.");
    }
    if (write.images() != null && write.images().size() > 8) {
      throw new BadRequestException("A Stay has at most 8 images.");
    }
    BigDecimal latitude = requiredCoord(write.latitude(), "latitude");
    BigDecimal longitude = requiredCoord(write.longitude(), "longitude");
    return new Parsed(
        kind,
        text(write.title()),
        text(write.description()),
        money(write.cost()),
        emptyToNull(write.phone()),
        emptyToNull(write.email()),
        emptyToNull(write.website()),
        latitude,
        longitude);
  }

  private static List<StayJdbc.StoredImage> storeImages(List<byte[]> images) {
    List<StayJdbc.StoredImage> stored = new ArrayList<>();
    if (images == null) {
      return stored;
    }
    int index = 0;
    for (byte[] raw : images) {
      boolean cover = index == 0;
      if (ImageCrop.check(raw) == ImageCrop.PhotoCheck.PHOTO) {
        ImageCrop.Cropped cropped = ImageCrop.crop(raw, cover);
        stored.add(new StayJdbc.StoredImage(cropped.jpeg(), cropped.width(), cropped.height(), "image/jpeg"));
      } else {
        stored.add(new StayJdbc.StoredImage(raw, 0, 0, "application/octet-stream"));
      }
      index++;
    }
    return stored;
  }

  private static BigDecimal requiredCoord(String raw, String name) {
    if (raw == null || raw.isBlank()) {
      throw new BadRequestException(name + " is required");
    }
    try {
      return new BigDecimal(raw.trim());
    } catch (NumberFormatException ex) {
      throw new BadRequestException(name + " is required");
    }
  }

  private static BigDecimal money(String raw) {
    if (raw == null || raw.isBlank()) {
      return null;
    }
    try {
      BigDecimal value = new BigDecimal(raw.trim());
      if (value.signum() < 0) {
        throw new BadRequestException("Cost, when you add it, is a number of euro.");
      }
      return value;
    } catch (NumberFormatException ex) {
      throw new BadRequestException("Cost, when you add it, is a number of euro.");
    }
  }

  private static String text(String raw) {
    return raw == null ? "" : raw;
  }

  private static String emptyToNull(String raw) {
    if (raw == null || raw.isBlank()) {
      return null;
    }
    return raw.trim();
  }

  private record Parsed(
      String kind,
      String title,
      String description,
      BigDecimal cost,
      String phone,
      String email,
      String website,
      BigDecimal latitude,
      BigDecimal longitude) {}

  public record StayWrite(
      String kind,
      String title,
      String description,
      String cost,
      String phone,
      String email,
      String website,
      String latitude,
      String longitude,
      List<byte[]> images,
      boolean keepImages) {}

  public void logReviewFailure(UUID id, Exception ex) {
    log.warn("Stay review error id={} — Stay stays hidden", id, ex);
  }
}
