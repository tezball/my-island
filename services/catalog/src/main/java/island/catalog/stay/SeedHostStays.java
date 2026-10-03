package island.catalog.stay;

import island.catalog.auth.CatalogSeedProperties;
import island.catalog.auth.UserJdbc;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.UUID;
import javax.imageio.ImageIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Demo hosts for the admin console. Password is the existing seed Guest password. The Google admin
 * account is not given a Stay.
 */
@Component
@EnableConfigurationProperties(CatalogSeedProperties.class)
public class SeedHostStays implements ApplicationRunner {

  public static final String CAMPSITE = "host-campsite";
  public static final String SUBMITTED = "host-submitted";
  public static final String REJECTED = "host-rejected";
  public static final String BANNED = "host-banned";
  public static final String BAN_REASON = "Banned for a file that is not a photo.";
  public static final String REJECT_FEEDBACK =
      "This does not read as a place to stay. Say what a guest stays in, then submit again.";

  private static final Logger log = LoggerFactory.getLogger(SeedHostStays.class);

  private final CatalogSeedProperties seed;
  private final UserJdbc users;
  private final PasswordEncoder passwords;
  private final StayJdbc stays;
  private final AdminProperties admin;

  public SeedHostStays(
      CatalogSeedProperties seed,
      UserJdbc users,
      PasswordEncoder passwords,
      StayJdbc stays,
      AdminProperties admin) {
    this.seed = seed;
    this.users = users;
    this.passwords = passwords;
    this.stays = stays;
    this.admin = admin;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (!StringUtils.hasText(seed.password())) {
      return;
    }
    seedHost(
        CAMPSITE,
        "Host campsite",
        "campsite",
        "Lakeside campsite",
        "A quiet campsite with pitches for tents. Guests stay overnight beside the lake and wake to birdsong.",
        new BigDecimal("35.00"),
        "+353 64 663 0000",
        "lakeside@example.com",
        new BigDecimal("52.059900"),
        new BigDecimal("-9.504400"),
        "kerry",
        "public",
        "pass",
        null,
        false);
    seedHost(
        SUBMITTED,
        "Host submitted",
        "lodge",
        "Forest lodge",
        "A timber lodge where guests stay overnight in the woods. One lodge on its own page.",
        null,
        null,
        null,
        new BigDecimal("53.801000"),
        new BigDecimal("-9.522000"),
        "mayo",
        "submitted",
        null,
        null,
        false);
    seedHost(
        REJECTED,
        "Host rejected",
        "apartment",
        "Town flat",
        "Quarterly widgets, invoices, and a parking memo for the office.",
        null,
        null,
        null,
        new BigDecimal("53.349800"),
        new BigDecimal("-6.260300"),
        "dublin",
        "hidden",
        "fail",
        REJECT_FEEDBACK,
        false);
    seedHost(
        BANNED,
        "Host banned",
        "glamping",
        "Pod glamping",
        "Glamping pods where guests stay overnight under the trees.",
        null,
        null,
        null,
        new BigDecimal("53.010000"),
        new BigDecimal("-6.329000"),
        "wicklow",
        "hidden",
        "fail",
        BAN_REASON,
        true);
    log.info(
        "Seeded Host Stays usernames={}, {}, {}, {}",
        CAMPSITE,
        SUBMITTED,
        REJECTED,
        BANNED);
  }

  private void seedHost(
      String username,
      String displayName,
      String kind,
      String title,
      String description,
      BigDecimal cost,
      String phone,
      String email,
      BigDecimal latitude,
      BigDecimal longitude,
      String countyId,
      String status,
      String review,
      String feedback,
      boolean banned) {
    String accountEmail = username + "@local.test";
    if (admin.googleEmail() != null && admin.googleEmail().equalsIgnoreCase(accountEmail)) {
      return;
    }
    users.upsertPasswordGuest(username, accountEmail, displayName, passwords.encode(seed.password()));
    UUID userId = users.findByUsername(username).orElseThrow().id();
    stays.ensureHost(userId);
    if (stays.hostHasStay(userId)) {
      return;
    }
    UUID stayId = UUID.randomUUID();
    stays.insertSeed(
        stayId,
        userId,
        kind,
        title,
        description,
        cost,
        phone,
        email,
        latitude,
        longitude,
        countyId,
        status,
        review,
        feedback);
    stays.replaceImages(
        stayId,
        java.util.List.of(
            new StayJdbc.StoredImage(coverJpeg(), ImageCrop.COVER_WIDTH, ImageCrop.COVER_HEIGHT, "image/jpeg")));
    if (banned) {
      stays.ban(userId, BAN_REASON);
    }
  }

  private static byte[] coverJpeg() {
    try {
      BufferedImage image = new BufferedImage(32, 32, BufferedImage.TYPE_INT_RGB);
      Graphics2D graphics = image.createGraphics();
      graphics.setColor(new Color(15, 56, 42));
      graphics.fillRect(0, 0, 32, 32);
      graphics.dispose();
      ByteArrayOutputStream raw = new ByteArrayOutputStream();
      ImageIO.write(image, "jpg", raw);
      return ImageCrop.crop(raw.toByteArray(), true).jpeg();
    } catch (Exception ex) {
      throw new IllegalStateException("Could not seed a Stay photo", ex);
    }
  }
}
