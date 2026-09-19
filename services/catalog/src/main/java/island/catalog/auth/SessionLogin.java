package island.catalog.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

public final class SessionLogin {

  private SessionLogin() {}

  public static void establish(AppUser user, HttpServletRequest request, HttpServletResponse response) {
    CatalogUserPrincipal principal =
        new CatalogUserPrincipal(user.id(), user.email(), user.displayName());
    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    new HttpSessionSecurityContextRepository().saveContext(context, request, response);
    request.getSession(true);
  }
}
