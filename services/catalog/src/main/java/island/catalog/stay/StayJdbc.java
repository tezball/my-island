package island.catalog.stay;

import island.catalog.api.dto.BannedAccountResponse;
import island.catalog.api.dto.CountyResponse;
import island.catalog.api.dto.StayResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class StayJdbc {

  public record StoredImage(byte[] bytes, int width, int height, String contentType) {}

  private static final String SELECT =
      """
      select s.id, s.host_user_id, s.kind, s.title, s.description, s.cost_eur, s.phone, s.email,
             s.website, s.latitude, s.longitude, s.county_id, s.status, s.review_outcome,
             s.review_feedback,
             c.name as county_name, c.country_code, c.ni,
             u.username as host_username,
             coalesce(h.banned, false) as host_banned,
             h.ban_reason,
             (select count(*) from stay_image i where i.stay_id = s.id) as image_count
      from stay s
      join app_user u on u.id = s.host_user_id
      left join host_role h on h.user_id = s.host_user_id
      left join county c on c.id = s.county_id
      """;

  private final JdbcClient jdbc;

  public StayJdbc(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  public void ensureHost(UUID userId) {
    jdbc.sql(
            """
            insert into host_role (user_id)
            values (:userId)
            on conflict (user_id) do nothing
            """)
        .param("userId", userId)
        .update();
  }

  public boolean isHost(UUID userId) {
    return count("select count(*) from host_role where user_id = :id", userId) > 0;
  }

  public boolean isBanned(UUID userId) {
    return count(
            "select count(*) from host_role where user_id = :id and banned = true", userId)
        > 0;
  }

  public String banReason(UUID userId) {
    return jdbc.sql("select ban_reason from host_role where user_id = :id")
        .param("id", userId)
        .query(String.class)
        .optional()
        .orElse(null);
  }

  public void ban(UUID userId, String reason) {
    ensureHost(userId);
    jdbc.sql(
            """
            update host_role
            set banned = true, ban_reason = :reason
            where user_id = :id
            """)
        .param("reason", reason)
        .param("id", userId)
        .update();
    jdbc.sql(
            """
            update stay
            set status = 'hidden', updated_at = now()
            where host_user_id = :id and status <> 'hidden'
            """)
        .param("id", userId)
        .update();
  }

  public void unban(UUID userId) {
    jdbc.sql(
            """
            update host_role
            set banned = false, ban_reason = null
            where user_id = :id
            """)
        .param("id", userId)
        .update();
  }

  public UUID insertSubmitted(
      UUID hostUserId,
      String kind,
      String title,
      String description,
      BigDecimal cost,
      String phone,
      String email,
      String website,
      BigDecimal latitude,
      BigDecimal longitude) {
    UUID id = UUID.randomUUID();
    jdbc.sql(
            """
            insert into stay (
              id, host_user_id, kind, title, description, cost_eur, phone, email, website,
              latitude, longitude, status
            ) values (
              :id, :host, :kind, :title, :description, :cost, :phone, :email, :website,
              :latitude, :longitude, 'submitted'
            )
            """)
        .param("id", id)
        .param("host", hostUserId)
        .param("kind", kind)
        .param("title", title)
        .param("description", description)
        .param("cost", cost)
        .param("phone", phone)
        .param("email", email)
        .param("website", website)
        .param("latitude", latitude)
        .param("longitude", longitude)
        .update();
    return id;
  }

  public void updateSubmitted(
      UUID id,
      UUID hostUserId,
      String kind,
      String title,
      String description,
      BigDecimal cost,
      String phone,
      String email,
      String website,
      BigDecimal latitude,
      BigDecimal longitude) {
    int rows =
        jdbc.sql(
                """
                update stay
                set kind = :kind,
                    title = :title,
                    description = :description,
                    cost_eur = :cost,
                    phone = :phone,
                    email = :email,
                    website = :website,
                    latitude = :latitude,
                    longitude = :longitude,
                    county_id = null,
                    status = 'submitted',
                    review_outcome = null,
                    review_feedback = null,
                    updated_at = now()
                where id = :id and host_user_id = :host
                """)
            .param("kind", kind)
            .param("title", title)
            .param("description", description)
            .param("cost", cost)
            .param("phone", phone)
            .param("email", email)
            .param("website", website)
            .param("latitude", latitude)
            .param("longitude", longitude)
            .param("id", id)
            .param("host", hostUserId)
            .update();
    if (rows == 0) {
      throw new StayNotFoundException();
    }
  }

  public void replaceImages(UUID stayId, List<StoredImage> images) {
    jdbc.sql("delete from stay_image where stay_id = :id").param("id", stayId).update();
    int position = 0;
    for (StoredImage image : images) {
      jdbc.sql(
              """
              insert into stay_image (id, stay_id, position, content_type, width, height, bytes)
              values (:id, :stayId, :position, :contentType, :width, :height, :bytes)
              """)
          .param("id", UUID.randomUUID())
          .param("stayId", stayId)
          .param("position", position)
          .param("contentType", image.contentType())
          .param("width", image.width())
          .param("height", image.height())
          .param("bytes", image.bytes())
          .update();
      position++;
    }
  }

  public void saveReview(UUID id, String countyId, StayReview.Result result) {
    jdbc.sql(
            """
            update stay
            set county_id = :county,
                status = :status,
                review_outcome = :review,
                review_feedback = :feedback,
                updated_at = now()
            where id = :id
            """)
        .param("county", countyId)
        .param("status", result.status())
        .param("review", result.review())
        .param("feedback", result.feedback())
        .param("id", id)
        .update();
  }

  public StayResponse require(UUID id) {
    return find(id).orElseThrow(StayNotFoundException::new);
  }

  public Optional<StayResponse> find(UUID id) {
    return jdbc.sql(SELECT + " where s.id = :id")
        .param("id", id)
        .query(this::map)
        .optional();
  }

  public List<StayResponse> listForHost(UUID hostUserId) {
    return jdbc.sql(SELECT + " where s.host_user_id = :id order by s.created_at desc")
        .param("id", hostUserId)
        .query(this::map)
        .list();
  }

  public List<StayResponse> listPublic() {
    return jdbc.sql(
            SELECT
                + """
                 where s.status = 'public' and coalesce(h.banned, false) = false
                 order by s.created_at desc
                """)
        .query(this::map)
        .list();
  }

  public List<StayResponse> listAll() {
    return jdbc.sql(SELECT + " order by s.updated_at desc").query(this::map).list();
  }

  public List<StayResponse> listStuck() {
    return jdbc.sql(
            SELECT
                + """
                 where s.status = 'submitted' and s.review_outcome is null
                 order by s.created_at
                """)
        .query(this::map)
        .list();
  }

  public List<BannedAccountResponse> bannedAccounts() {
    return jdbc.sql(
            """
            select u.id, u.username, u.email, h.ban_reason
            from host_role h
            join app_user u on u.id = h.user_id
            where h.banned = true
            order by u.username
            """)
        .query(
            (rs, n) ->
                new BannedAccountResponse(
                    rs.getObject("id", UUID.class).toString(),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("ban_reason")))
        .list();
  }

  public List<byte[]> imageBytes(UUID stayId) {
    return jdbc.sql(
            """
            select bytes from stay_image
            where stay_id = :id
            order by position
            """)
        .param("id", stayId)
        .query((rs, n) -> rs.getBytes("bytes"))
        .list();
  }

  public Optional<StoredImage> image(UUID stayId, int position) {
    return jdbc.sql(
            """
            select bytes, width, height, content_type
            from stay_image
            where stay_id = :id and position = :position
            """)
        .param("id", stayId)
        .param("position", position)
        .query(
            (rs, n) ->
                new StoredImage(
                    rs.getBytes("bytes"),
                    rs.getInt("width"),
                    rs.getInt("height"),
                    rs.getString("content_type")))
        .optional();
  }

  public boolean hostHasStay(UUID hostUserId) {
    return count("select count(*) from stay where host_user_id = :id", hostUserId) > 0;
  }

  public void insertSeed(
      UUID id,
      UUID hostUserId,
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
      String feedback) {
    jdbc.sql(
            """
            insert into stay (
              id, host_user_id, kind, title, description, cost_eur, phone, email,
              latitude, longitude, county_id, status, review_outcome, review_feedback
            ) values (
              :id, :host, :kind, :title, :description, :cost, :phone, :email,
              :latitude, :longitude, :county, :status, :review, :feedback
            )
            """)
        .param("id", id)
        .param("host", hostUserId)
        .param("kind", kind)
        .param("title", title)
        .param("description", description)
        .param("cost", cost)
        .param("phone", phone)
        .param("email", email)
        .param("latitude", latitude)
        .param("longitude", longitude)
        .param("county", countyId)
        .param("status", status)
        .param("review", review)
        .param("feedback", feedback)
        .update();
  }

  private StayResponse map(java.sql.ResultSet rs, int row) throws java.sql.SQLException {
    String countyId = rs.getString("county_id");
    CountyResponse county =
        countyId == null
            ? null
            : new CountyResponse(
                countyId, rs.getString("county_name"), rs.getString("country_code"), rs.getBoolean("ni"));
    UUID hostId = rs.getObject("host_user_id", UUID.class);
    return new StayResponse(
        rs.getObject("id", UUID.class).toString(),
        rs.getString("kind"),
        rs.getString("title"),
        rs.getString("description"),
        rs.getBigDecimal("cost_eur"),
        "EUR",
        rs.getString("phone"),
        rs.getString("email"),
        rs.getString("website"),
        rs.getBigDecimal("latitude"),
        rs.getBigDecimal("longitude"),
        county,
        rs.getString("status"),
        rs.getString("review_outcome"),
        rs.getString("review_feedback"),
        rs.getInt("image_count"),
        hostId.toString(),
        rs.getString("host_username"),
        rs.getBoolean("host_banned"),
        rs.getString("ban_reason"));
  }

  private int count(String sql, UUID id) {
    return jdbc.sql(sql).param("id", id).query(Integer.class).single();
  }
}
