package island.catalog.api;

import island.catalog.api.dto.GoogleAuthRequest;
import island.catalog.api.dto.PasswordLoginRequest;
import island.catalog.auth.AppUser;
import island.catalog.auth.GoogleIdTokenVerification;
import island.catalog.auth.InvalidCredentialsException;
import island.catalog.auth.SessionLogin;
import island.catalog.auth.UserJdbc;
import island.catalog.auth.VerifiedGoogleIdentity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.util.StringUtils;
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
  private final PasswordEncoder passwords;

  public AuthController(
      GoogleIdTokenVerification googleTokens, UserJdbc users, PasswordEncoder passwords) {
    this.googleTokens = googleTokens;
    this.users = users;
    this.passwords = passwords;
  }

  @PostMapping("/google")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void google(
      @Valid @RequestBody GoogleAuthRequest body,
      HttpServletRequest request,
      HttpServletResponse response) {
    VerifiedGoogleIdentity identity = googleTokens.verify(body.idToken());
    AppUser user = users.upsertGoogle(identity);
    SessionLogin.establish(user, request, response);
  }

  @PostMapping("/login")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void login(
      @Valid @RequestBody PasswordLoginRequest body,
      HttpServletRequest request,
      HttpServletResponse response) {
    AppUser user =
        users
            .findByUsername(body.username())
            .orElseThrow(InvalidCredentialsException::new);
    String hash = users.passwordHashForUsername(body.username()).orElse(null);
    if (!StringUtils.hasText(hash) || !passwords.matches(body.password(), hash)) {
      throw new InvalidCredentialsException();
    }
    SessionLogin.establish(user, request, response);
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
