package island.catalog.api;

import island.catalog.api.dto.MeResponse;
import island.catalog.auth.AppUser;
import island.catalog.auth.CatalogUserPrincipal;
import island.catalog.auth.UserJdbc;
import island.catalog.stay.AdminAccess;
import island.catalog.stay.StayJdbc;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class MeController {

  private final UserJdbc users;
  private final StayJdbc stays;
  private final AdminAccess admin;

  public MeController(UserJdbc users, StayJdbc stays, AdminAccess admin) {
    this.users = users;
    this.stays = stays;
    this.admin = admin;
  }

  @GetMapping("/me")
  MeResponse me(@AuthenticationPrincipal CatalogUserPrincipal principal) {
    AppUser user =
        users
            .findById(principal.id())
            .orElseGet(() -> new AppUser(principal.id(), principal.email(), principal.displayName(), false));
    return new MeResponse(
        user.id().toString(),
        user.email(),
        user.displayName(),
        user.emailVerified(),
        stays.isHost(user.id()),
        stays.isBanned(user.id()),
        stays.banReason(user.id()),
        admin.isAdmin(principal));
  }
}
