package island.catalog.auth;

import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserJdbc {

  private static final String ISSUER_GOOGLE = "google";

  private final JdbcTemplate jdbc;

  public UserJdbc(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  Optional<AppUser> findByGoogleSubject(String subject) {
    try {
      return Optional.of(
          jdbc.queryForObject(
              """
              select u.id, u.email, u.display_name
              from app_user u
              join user_identity i on i.user_id = u.id
              where i.issuer = ? and i.subject = ?
              """,
              (rs, rowNum) ->
                  new AppUser(
                      rs.getObject("id", UUID.class),
                      rs.getString("email"),
                      rs.getString("display_name")),
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
              select id, email, display_name
              from app_user
              where lower(username) = lower(?)
              """,
              (rs, rowNum) ->
                  new AppUser(
                      rs.getObject("id", UUID.class),
                      rs.getString("email"),
                      rs.getString("display_name")),
              username));
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
          set email = ?, display_name = ?, password_hash = ?, updated_at = now()
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
        insert into app_user (id, email, display_name, username, password_hash)
        values (?, ?, ?, ?, ?)
        """,
        userId,
        email,
        displayName,
        username,
        passwordHash);
  }

  public AppUser upsertGoogle(VerifiedGoogleIdentity identity) {
    Optional<AppUser> existing = findByGoogleSubject(identity.subject());
    if (existing.isPresent()) {
      AppUser user = existing.get();
      jdbc.update(
          """
          update app_user
          set email = ?, display_name = ?, updated_at = now()
          where id = ?
          """,
          identity.email(),
          identity.displayName(),
          user.id());
      return new AppUser(user.id(), identity.email(), identity.displayName());
    }

    UUID userId = UUID.randomUUID();
    jdbc.update(
        """
        insert into app_user (id, email, display_name)
        values (?, ?, ?)
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
    return new AppUser(userId, identity.email(), identity.displayName());
  }
}
