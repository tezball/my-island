package island.catalog.api;

import island.catalog.api.dto.MeResponse;
import island.catalog.auth.CatalogUserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class MeController {

  @GetMapping("/me")
  MeResponse me(@AuthenticationPrincipal CatalogUserPrincipal principal) {
    return new MeResponse(principal.id().toString(), principal.email(), principal.displayName());
  }
}
