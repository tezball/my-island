package island.catalog.place;

import island.catalog.api.dto.CreatePlaceRequest;
import island.catalog.api.dto.PlaceResponse;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlaceService {

  private static final Set<String> PRICE_BANDS = Set.of("FREE", "1", "2", "3");

  private final PlaceJdbc places;
  private final LookupJdbc lookups;

  public PlaceService(PlaceJdbc places, LookupJdbc lookups) {
    this.places = places;
    this.lookups = lookups;
  }

  @Transactional
  public PlaceResponse create(CreatePlaceRequest request) {
    if (!lookups.categoryExists(request.categoryId())) {
      throw new BadRequestException("Unknown category: " + request.categoryId());
    }
    if (!lookups.countyExists(request.countyId())) {
      throw new BadRequestException("Unknown county: " + request.countyId());
    }
    for (String facilityId : request.facilityIds()) {
      if (!lookups.facilityExists(facilityId)) {
        throw new BadRequestException("Unknown facility: " + facilityId);
      }
    }
    String priceBand = blankToNull(request.priceBand());
    if (priceBand != null && !PRICE_BANDS.contains(priceBand)) {
      throw new BadRequestException("priceBand must be FREE, 1, 2, or 3");
    }
    String slug = blankToNull(request.slug());
    if (slug == null) {
      slug = slugify(request.name());
    }
    if (slug.isBlank()) {
      throw new BadRequestException("Could not derive a slug from name");
    }
    if (places.slugExists(slug)) {
      throw new DuplicateSlugException(slug);
    }
    UUID id = UUID.randomUUID();
    boolean published = Boolean.TRUE.equals(request.published());
    places.insert(
        id,
        slug,
        request.name().trim(),
        blankToNull(request.description()),
        request.categoryId(),
        request.countyId(),
        blankToNull(request.town()),
        request.latitude(),
        request.longitude(),
        published,
        priceBand,
        blankToNull(request.website()),
        blankToNull(request.phone()));
    places.replaceFacilities(id, request.facilityIds());
    return places
        .findById(id)
        .orElseThrow(() -> new IllegalStateException("Place insert did not persist"));
  }

  public List<PlaceResponse> list(String categoryId, String countyId, Boolean published) {
    return places.list(blankToNull(categoryId), blankToNull(countyId), published);
  }

  public PlaceResponse get(String idOrSlug) {
    if (looksLikeUuid(idOrSlug)) {
      var byId = places.findById(UUID.fromString(idOrSlug));
      if (byId.isPresent()) {
        return byId.get();
      }
    }
    return places.findBySlug(idOrSlug).orElseThrow(() -> new PlaceNotFoundException(idOrSlug));
  }

  static String slugify(String name) {
    String slug =
        name.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-+|-+$", "");
    return slug;
  }

  private static String blankToNull(String value) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }

  private static boolean looksLikeUuid(String value) {
    try {
      UUID.fromString(value);
      return true;
    } catch (IllegalArgumentException ex) {
      return false;
    }
  }
}
