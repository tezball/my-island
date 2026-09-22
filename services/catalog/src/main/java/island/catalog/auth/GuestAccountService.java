package island.catalog.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@EnableConfigurationProperties(CatalogMailProperties.class)
public class GuestAccountService {

  private static final Duration VERIFY_TTL = Duration.ofHours(24);
  private static final Duration RESET_TTL = Duration.ofHours(1);

  private final UserJdbc users;
  private final PasswordEncoder passwords;
  private final GuestMail mail;
  private final CatalogMailProperties props;
  private final SecureRandom random = new SecureRandom();

  public GuestAccountService(
      UserJdbc users, PasswordEncoder passwords, GuestMail mail, CatalogMailProperties props) {
    this.users = users;
    this.passwords = passwords;
    this.mail = mail;
    this.props = props;
  }

  public AppUser signup(String username, String email, String rawPassword) {
    String token = newToken();
    AppUser user =
        users.insertSignup(
            username.trim(),
            email.trim(),
            username.trim(),
            passwords.encode(rawPassword),
            token,
            Instant.now().plus(VERIFY_TTL));
    String origin = StringUtils.hasText(props.publicOrigin()) ? props.publicOrigin() : "http://localhost:5173";
    mail.send(
        user.email(),
        "Verify your guest account",
        "Open " + origin + "/verify?token=" + token + " to verify this guest account.");
    return user;
  }

  public AppUser verify(String token) {
    return users.consumeVerifyToken(token).orElseThrow(InvalidTokenException::new);
  }

  public void forgot(String usernameOrEmail) {
    Optional<AppUser> user = users.findByUsername(usernameOrEmail.trim());
    if (user.isEmpty()) {
      user = users.findByEmail(usernameOrEmail.trim());
    }
    if (user.isEmpty()) {
      return;
    }
    String token = newToken();
    users.storeResetToken(user.get().id(), token, Instant.now().plus(RESET_TTL));
    String origin = StringUtils.hasText(props.publicOrigin()) ? props.publicOrigin() : "http://localhost:5173";
    mail.send(
        user.get().email(),
        "Reset your guest password",
        "Open " + origin + "/reset?token=" + token + " to choose a new password.");
  }

  public void reset(String token, String rawPassword) {
    users
        .consumeResetToken(token, passwords.encode(rawPassword))
        .orElseThrow(InvalidTokenException::new);
  }

  private String newToken() {
    byte[] bytes = new byte[32];
    random.nextBytes(bytes);
    return HexFormat.of().formatHex(bytes);
  }
}
