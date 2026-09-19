package island.catalog.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@EnableConfigurationProperties(CatalogSeedProperties.class)
public class SeedGuestRunner implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(SeedGuestRunner.class);

  private final CatalogSeedProperties seed;
  private final UserJdbc users;
  private final PasswordEncoder passwords;

  public SeedGuestRunner(CatalogSeedProperties seed, UserJdbc users, PasswordEncoder passwords) {
    this.seed = seed;
    this.users = users;
    this.passwords = passwords;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (!StringUtils.hasText(seed.username()) || !StringUtils.hasText(seed.password())) {
      return;
    }
    String email =
        StringUtils.hasText(seed.email()) ? seed.email() : seed.username() + "@local.test";
    users.upsertPasswordGuest(
        seed.username().trim(), email.trim(), "Guest", passwords.encode(seed.password()));
    log.info("Seeded password Guest username={}", seed.username());
  }
}
