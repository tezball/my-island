package island.catalog.api;

import island.catalog.api.dto.GoogleAuthRequest;
import island.catalog.auth.AppUser;
import island.catalog.auth.CatalogUserPrincipal;
import island.catalog.auth.GoogleIdTokenVerification;
import island.catalog.auth.UserJdbc;
import island.catalog.auth.VerifiedGoogleIdentity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final GoogleIdTokenVerification googleTokens;
  private final UserJdbc users;

  public AuthController(GoogleIdTokenVerification googleTokens, UserJdbc users) {
    this.googleTokens = googleTokens;
    this.users = users;
  }

  @PostMapping("/google")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void google(
      @Valid @RequestBody GoogleAuthRequest body,
      HttpServletRequest request,
      HttpServletResponse response) {
    VerifiedGoogleIdentity identity = googleTokens.verify(body.idToken());
    AppUser user = users.upsertGoogle(identity);
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

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void logout(HttpServletRequest request, HttpServletResponse response) {
    SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
    logoutHandler.setInvalidateHttpSession(true);
    logoutHandler.setClearAuthentication(true);
    logoutHandler.logout(
        request, response, SecurityContextHolder.getContext().getAuthentication());
    SecurityContextHolder.clearContext();
  }
}
