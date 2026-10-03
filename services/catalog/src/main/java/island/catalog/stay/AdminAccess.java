package island.catalog.stay;

import island.catalog.auth.CatalogUserPrincipal;
import island.catalog.auth.UserJdbc;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class AdminAccess {

  private final AdminProperties admin;
  private final UserJdbc users;

  public AdminAccess(AdminProperties admin, UserJdbc users) {
    this.admin = admin;
    this.users = users;
  }

  public boolean isAdmin(CatalogUserPrincipal principal) {
    if (principal == null || !StringUtils.hasText(admin.googleEmail())) {
      return false;
    }
    if (!admin.googleEmail().equalsIgnoreCase(principal.email())) {
      return false;
    }
    return users.hasGoogleIdentity(principal.id());
  }

  public void require(CatalogUserPrincipal principal) {
    if (!isAdmin(principal)) {
      throw new ForbiddenException();
    }
  }
}
