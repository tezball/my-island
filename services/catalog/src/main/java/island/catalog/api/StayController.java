package island.catalog.api;

import island.catalog.api.dto.CountyResponse;
import island.catalog.api.dto.StayResponse;
import island.catalog.place.LookupJdbc;
import island.catalog.stay.CountyLocator;
import island.catalog.stay.StayJdbc;
import island.catalog.stay.StayNotFoundException;
import island.catalog.stay.StayService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stays")
public class StayController {

  private final StayService stays;
  private final StayJdbc jdbc;
  private final CountyLocator counties;
  private final LookupJdbc lookups;

  public StayController(
      StayService stays, StayJdbc jdbc, CountyLocator counties, LookupJdbc lookups) {
    this.stays = stays;
    this.jdbc = jdbc;
    this.counties = counties;
    this.lookups = lookups;
  }

  @GetMapping
  List<StayResponse> list() {
    return stays.listPublic();
  }

  @GetMapping("/county")
  CountyResponse county(@RequestParam double latitude, @RequestParam double longitude) {
    String id = counties.id(latitude, longitude);
    if (id == null) {
      throw new StayNotFoundException();
    }
    return lookups.county(id).orElseThrow(StayNotFoundException::new);
  }

  @GetMapping("/{id}")
  StayResponse get(@PathVariable String id) {
    return stays.requirePublic(uuid(id));
  }

  @GetMapping("/{id}/images/{position}")
  ResponseEntity<byte[]> image(@PathVariable String id, @PathVariable int position) {
    UUID stayId = uuid(id);
    stays.requirePublic(stayId);
    StayJdbc.StoredImage image =
        jdbc.image(stayId, position).filter(row -> row.width() > 0).orElseThrow(StayNotFoundException::new);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
        .body(image.bytes());
  }

  private static UUID uuid(String raw) {
    try {
      return UUID.fromString(raw);
    } catch (IllegalArgumentException ex) {
      throw new StayNotFoundException();
    }
  }
}
