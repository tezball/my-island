package island.catalog.auth;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserJdbc {

  private static final String ISSUER_GOOGLE = "google";

  private static final RowMapper<AppUser> USER =
      (rs, rowNum) ->
          new AppUser(
              rs.getObject("id", UUID.class),
              rs.getString("email"),
              rs.getString("display_name"),
              rs.getBoolean("email_verified"));

  private final JdbcTemplate jdbc;

  public UserJdbc(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  Optional<AppUser> findByGoogleSubject(String subject) {
    try {
      return Optional.of(
          jdbc.queryForObject(
              """
              select u.id, u.email, u.display_name, u.email_verified
              from app_user u
              join user_identity i on i.user_id = u.id
              where i.issuer = ? and i.subject = ?
              """,
              USER,
              ISSUER_GOOGLE,
              subject));
    } catch (EmptyResultDataAccessException ex) {
      return Optional.empty();
    }
  }

  public Optional<AppUser> findByUsername(String username) {
    try {
      return Optional.of(
          jdbc.queryForObject(
              """
              select id, email, display_name, email_verified
              from app_user
              where lower(username) = lower(?)
              """,
              USER,
              username));
    } catch (EmptyResultDataAccessException ex) {
      return Optional.empty();
    }
  }

  public Optional<AppUser> findByEmail(String email) {
    try {
      return Optional.of(
          jdbc.queryForObject(
              """
              select id, email, display_name, email_verified
              from app_user
              where lower(email) = lower(?)
              """,
              USER,
              email));
    } catch (EmptyResultDataAccessException ex) {
      return Optional.empty();
    }
  }

  public Optional<AppUser> findById(UUID id) {
    try {
      return Optional.of(
          jdbc.queryForObject(
              """
              select id, email, display_name, email_verified
              from app_user
              where id = ?
              """,
              USER,
              id));
    } catch (EmptyResultDataAccessException ex) {
      return Optional.empty();
    }
  }

  public Optional<String> passwordHashForUsername(String username) {
    try {
      return Optional.ofNullable(
          jdbc.queryForObject(
              """
              select password_hash from app_user
              where lower(username) = lower(?)
              """,
              String.class,
              username));
    } catch (EmptyResultDataAccessException ex) {
      return Optional.empty();
    }
  }

  public void upsertPasswordGuest(String username, String email, String displayName, String passwordHash) {
    Optional<AppUser> existing = findByUsername(username);
    if (existing.isPresent()) {
      jdbc.update(
          """
          update app_user
          set email = ?, display_name = ?, password_hash = ?, email_verified = true, updated_at = now()
          where id = ?
          """,
          email,
          displayName,
          passwordHash,
          existing.get().id());
      return;
    }
    UUID userId = UUID.randomUUID();
    jdbc.update(
        """
        insert into app_user (id, email, display_name, username, password_hash, email_verified)
        values (?, ?, ?, ?, ?, true)
        """,
        userId,
        email,
        displayName,
        username,
        passwordHash);
  }

  public AppUser insertSignup(
      String username, String email, String displayName, String passwordHash, String verifyToken, Instant verifyExpires) {
    UUID userId = UUID.randomUUID();
    try {
      jdbc.update(
          """
          insert into app_user (
            id, email, display_name, username, password_hash, email_verified, verify_token, verify_expires_at
          )
          values (?, ?, ?, ?, ?, false, ?, ?)
          """,
          userId,
          email,
          displayName,
          username,
          passwordHash,
          verifyToken,
          Timestamp.from(verifyExpires));
    } catch (DataIntegrityViolationException ex) {
      throw new DuplicateAccountException();
    }
    return new AppUser(userId, email, displayName, false);
  }

  public Optional<AppUser> consumeVerifyToken(String token) {
    UUID id = tokenUser("verify_token", "verify_expires_at", token);
    if (id == null) {
      return Optional.empty();
    }
    jdbc.update(
        """
        update app_user
        set email_verified = true, verify_token = null, verify_expires_at = null, updated_at = now()
        where id = ?
        """,
        id);
    return findById(id);
  }

  public void storeResetToken(UUID id, String token, Instant expires) {
    jdbc.update(
        """
        update app_user
        set reset_token = ?, reset_expires_at = ?, updated_at = now()
        where id = ?
        """,
        token,
        Timestamp.from(expires),
        id);
  }

  public Optional<AppUser> consumeResetToken(String token, String passwordHash) {
    UUID id = tokenUser("reset_token", "reset_expires_at", token);
    if (id == null) {
      return Optional.empty();
    }
    jdbc.update(
        """
        update app_user
        set password_hash = ?, reset_token = null, reset_expires_at = null, email_verified = true, updated_at = now()
        where id = ?
        """,
        passwordHash,
        id);
    return findById(id);
  }

  public AppUser upsertGoogle(VerifiedGoogleIdentity identity) {
    Optional<AppUser> existing = findByGoogleSubject(identity.subject());
    if (existing.isPresent()) {
      AppUser user = existing.get();
      jdbc.update(
          """
          update app_user
          set email = ?, display_name = ?, email_verified = true, updated_at = now()
          where id = ?
          """,
          identity.email(),
          identity.displayName(),
          user.id());
      return new AppUser(user.id(), identity.email(), identity.displayName(), true);
    }

    UUID userId = UUID.randomUUID();
    jdbc.update(
        """
        insert into app_user (id, email, display_name, email_verified)
        values (?, ?, ?, true)
        """,
        userId,
        identity.email(),
        identity.displayName());
    jdbc.update(
        """
        insert into user_identity (user_id, issuer, subject)
        values (?, ?, ?)
        """,
        userId,
        ISSUER_GOOGLE,
        identity.subject());
    return new AppUser(userId, identity.email(), identity.displayName(), true);
  }

  private UUID tokenUser(String tokenColumn, String expiryColumn, String token) {
    try {
      return jdbc.queryForObject(
          """
          select id from app_user
          where %s = ? and %s > now()
          """
              .formatted(tokenColumn, expiryColumn),
          UUID.class,
          token);
    } catch (EmptyResultDataAccessException ex) {
      return null;
    }
  }
}
