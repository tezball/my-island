package island.catalog.api;

import island.catalog.api.dto.BannedAccountResponse;
import island.catalog.api.dto.StayResponse;
import island.catalog.auth.CatalogUserPrincipal;
import island.catalog.stay.AdminAccess;
import island.catalog.stay.StayJdbc;
import island.catalog.stay.StayNotFoundException;
import island.catalog.stay.StayService;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminStayController {

  private final AdminAccess admin;
  private final StayJdbc stays;
  private final StayService service;

  public AdminStayController(AdminAccess admin, StayJdbc stays, StayService service) {
    this.admin = admin;
    this.stays = stays;
    this.service = service;
  }

  @GetMapping("/stays")
  List<StayResponse> stays(@AuthenticationPrincipal CatalogUserPrincipal principal) {
    admin.require(principal);
    return stays.listAll();
  }

  @GetMapping("/stays/stuck")
  List<StayResponse> stuck(@AuthenticationPrincipal CatalogUserPrincipal principal) {
    admin.require(principal);
    return stays.listStuck();
  }

  @GetMapping("/bans")
  List<BannedAccountResponse> bans(@AuthenticationPrincipal CatalogUserPrincipal principal) {
    admin.require(principal);
    return stays.bannedAccounts();
  }

  @PostMapping("/stays/{id}/review")
  StayResponse review(
      @AuthenticationPrincipal CatalogUserPrincipal principal, @PathVariable String id) {
    admin.require(principal);
    try {
      return service.reviewNow(uuid(id));
    } catch (StayNotFoundException ex) {
      throw ex;
    } catch (RuntimeException ex) {
      service.logReviewFailure(uuid(id), ex);
      return stays.require(uuid(id));
    }
  }

  @PostMapping("/bans/{userId}/unban")
  BannedAccountResponse unban(
      @AuthenticationPrincipal CatalogUserPrincipal principal, @PathVariable String userId) {
    admin.require(principal);
    UUID id = uuid(userId);
    stays.unban(id);
    return new BannedAccountResponse(id.toString(), null, null, null);
  }

  private static UUID uuid(String raw) {
    try {
      return UUID.fromString(raw);
    } catch (IllegalArgumentException ex) {
      throw new StayNotFoundException();
    }
  }
}
