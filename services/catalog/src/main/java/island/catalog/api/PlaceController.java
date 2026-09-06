package island.catalog.api;

import island.catalog.api.dto.CreatePlaceRequest;
import island.catalog.api.dto.PlaceResponse;
import island.catalog.place.PlaceService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/places")
public class PlaceController {

  private final PlaceService places;

  public PlaceController(PlaceService places) {
    this.places = places;
  }

  @PostMapping
  public ResponseEntity<PlaceResponse> create(@Valid @RequestBody CreatePlaceRequest request) {
    PlaceResponse body = places.create(request);
    return ResponseEntity.created(URI.create("/api/v1/places/" + body.id())).body(body);
  }

  @GetMapping
  public List<PlaceResponse> list(
      @RequestParam(required = false) String categoryId,
      @RequestParam(required = false) String countyId,
      @RequestParam(required = false) Boolean published) {
    return places.list(categoryId, countyId, published);
  }

  @GetMapping("/{idOrSlug}")
  public PlaceResponse get(@PathVariable String idOrSlug) {
    return places.get(idOrSlug);
  }
}
