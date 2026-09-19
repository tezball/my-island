package island.catalog.api;

import island.catalog.api.dto.VisitIntentRequest;
import island.catalog.api.dto.VisitIntentResponse;
import island.catalog.auth.CatalogUserPrincipal;
import island.catalog.visit.VisitIntent;
import island.catalog.visit.VisitIntentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/me")
public class VisitIntentController {

  private final VisitIntentService intents;

  public VisitIntentController(VisitIntentService intents) {
    this.intents = intents;
  }

  @GetMapping("/visit-intents")
  List<VisitIntentResponse> list(
      @AuthenticationPrincipal CatalogUserPrincipal principal,
      @RequestParam(required = false) String mark) {
    return intents.list(principal.id(), mark).stream().map(VisitIntentController::toDto).toList();
  }

  @GetMapping("/places/{placeId}/visit-intent")
  VisitIntentResponse get(
      @AuthenticationPrincipal CatalogUserPrincipal principal, @PathVariable UUID placeId) {
    return intents
        .get(principal.id(), placeId)
        .map(VisitIntentController::toDto)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PutMapping("/places/{placeId}/visit-intent")
  VisitIntentResponse put(
      @AuthenticationPrincipal CatalogUserPrincipal principal,
      @PathVariable UUID placeId,
      @Valid @RequestBody VisitIntentRequest body) {
    return toDto(intents.upsert(principal.id(), placeId, body.mark()));
  }

  @DeleteMapping("/places/{placeId}/visit-intent")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(
      @AuthenticationPrincipal CatalogUserPrincipal principal, @PathVariable UUID placeId) {
    intents.delete(principal.id(), placeId);
  }

  private static VisitIntentResponse toDto(VisitIntent row) {
    return new VisitIntentResponse(row.placeId(), row.mark(), row.updatedAt());
  }
}
