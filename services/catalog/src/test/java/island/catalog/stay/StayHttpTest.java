package island.catalog.stay;

import static org.assertj.core.api.Assertions.assertThat;

import island.catalog.support.CatalogPostgis;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class StayHttpTest {

  @DynamicPropertySource
  static void datasource(DynamicPropertyRegistry registry) {
    CatalogPostgis.datasource(registry);
  }

  @Autowired TestRestTemplate http;
  @Autowired StayService stays;
  @Autowired JdbcTemplate jdbc;

  @Test
  void anonymousPlacePostStaysClosedAndHostWritesAreAuthenticated() {
    HttpHeaders json = new HttpHeaders();
    json.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<String> post =
        http.exchange(
            "/api/v1/places", HttpMethod.POST, new HttpEntity<>("{}", json), String.class);
    assertThat(post.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

    ResponseEntity<String> host =
        http.exchange("/api/v1/host/stays", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), String.class);
    assertThat(host.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

    ResponseEntity<Map> county =
        http.getForEntity("/api/v1/stays/county?latitude=53.3498&longitude=-6.2603", Map.class);
    assertThat(county.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(county.getBody().get("id")).isEqualTo("dublin");
  }

  @Test
  void editHidesAPublicStayUntilReviewPassesAgain() throws Exception {
    HttpHeaders session = signup("edit-" + UUID.randomUUID().toString().substring(0, 8));
    String id = createStay(session, "Edit campsite", stayText(), "53.2707", "-9.0568", null);
    assertThat(hostStatus(session, id)).isEqualTo("submitted");
    assertThat(publicTitles()).doesNotContain("Edit campsite");
    stays.reviewNow(UUID.fromString(id));
    assertThat(hostStatus(session, id)).isEqualTo("public");
    assertThat(publicTitles()).contains("Edit campsite");

    MultiValueMap<String, Object> form = baseForm("Edit campsite again", stayText(), "53.2707", "-9.0568");
    form.add("keepImages", "true");
    ResponseEntity<Map> updated =
        http.exchange(
            "/api/v1/host/stays/" + id,
            HttpMethod.PUT,
            new HttpEntity<>(form, session),
            Map.class);
    assertThat(updated.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(updated.getBody().get("status")).isEqualTo("submitted");
    assertThat(publicTitles()).doesNotContain("Edit campsite again");
    stays.reviewNow(UUID.fromString(id));
    assertThat(publicTitles()).contains("Edit campsite again");
  }

  @Test
  void fitFailureIsFeedbackAndNotABan() throws Exception {
    HttpHeaders session = signup("fit-" + UUID.randomUUID().toString().substring(0, 8));
    String id = createStay(session, "Paris campsite", stayText(), "48.8566", "2.3522", null);
    Map reviewed = stays.reviewNow(UUID.fromString(id)) == null ? Map.of() : host(session, id);
    assertThat(reviewed.get("status")).isEqualTo("hidden");
    assertThat(reviewed.get("feedback").toString()).contains("32 Irish counties");
    Map me = me(session);
    assertThat(me.get("banned")).isEqualTo(false);
  }

  @Test
  void adminCanRerunReviewAndUnbanDoesNotPublish() throws Exception {
    HttpHeaders admin = google("stub:terry-admin:tezball86@gmail.com:Terry");
    ResponseEntity<List> all =
        http.exchange("/api/v1/admin/stays", HttpMethod.GET, new HttpEntity<>(admin), List.class);
    assertThat(all.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(all.getBody().toString()).contains("Lakeside campsite");

    ResponseEntity<List> stuck =
        http.exchange("/api/v1/admin/stays/stuck", HttpMethod.GET, new HttpEntity<>(admin), List.class);
    assertThat(stuck.getBody().toString()).contains("Forest lodge");

    ResponseEntity<List> bans =
        http.exchange("/api/v1/admin/bans", HttpMethod.GET, new HttpEntity<>(admin), List.class);
    assertThat(bans.getBody().toString()).contains("host-banned");
    assertThat(bans.getBody().toString()).contains(SeedHostStays.BAN_REASON);

    HttpHeaders stranger = signup("stranger-" + UUID.randomUUID().toString().substring(0, 8));
    ResponseEntity<String> denied =
        http.exchange("/api/v1/admin/stays", HttpMethod.GET, new HttpEntity<>(stranger), String.class);
    assertThat(denied.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

    Integer adminStays =
        jdbc.queryForObject(
            """
            select count(*) from stay s
            join app_user u on u.id = s.host_user_id
            where lower(u.email) = lower(?)
            """,
            Integer.class,
            "tezball86@gmail.com");
    assertThat(adminStays).isZero();

    HttpHeaders bannedHost = signup("ban-" + UUID.randomUUID().toString().substring(0, 8));
    String id =
        createStay(
            bannedHost,
            "Banned campsite",
            "<script>alert(1)</script>",
            "52.0599",
            "-9.5044",
            null);
    stays.reviewNow(UUID.fromString(id));
    assertThat(host(bannedHost, id).get("status")).isEqualTo("hidden");
    String userId = me(bannedHost).get("id").toString();
    ResponseEntity<String> unban =
        http.exchange(
            "/api/v1/admin/bans/" + userId + "/unban",
            HttpMethod.POST,
            new HttpEntity<>(admin),
            String.class);
    assertThat(unban.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(me(bannedHost).get("banned")).isEqualTo(false);
    assertThat(host(bannedHost, id).get("status")).isEqualTo("hidden");
    assertThat(publicTitles()).doesNotContain("Banned campsite");

    ResponseEntity<String> publish =
        http.exchange(
            "/api/v1/admin/stays/" + id + "/publish",
            HttpMethod.POST,
            new HttpEntity<>(admin),
            String.class);
    assertThat(publish.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    assertThat(host(bannedHost, id).get("status")).isEqualTo("hidden");
  }

  @Test
  void seededRejectedStayKeepsFeedback() {
    String feedback =
        jdbc.queryForObject(
            """
            select s.review_feedback from stay s
            join app_user u on u.id = s.host_user_id
            where u.username = ?
            """,
            String.class,
            SeedHostStays.REJECTED);
    assertThat(feedback).isEqualTo(SeedHostStays.REJECT_FEEDBACK);
    String status =
        jdbc.queryForObject(
            """
            select s.status from stay s
            join app_user u on u.id = s.host_user_id
            where u.username = ?
            """,
            String.class,
            SeedHostStays.CAMPSITE);
    assertThat(status).isEqualTo("public");
  }

  private HttpHeaders signup(String username) {
    HttpHeaders json = new HttpHeaders();
    json.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<Void> signup =
        http.exchange(
            "/api/auth/signup",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\""
                    + username
                    + "\",\"email\":\""
                    + username
                    + "@example.com\",\"password\":\"password1\"}",
                json),
            Void.class);
    assertThat(signup.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    return cookie(signup);
  }

  private HttpHeaders google(String token) {
    HttpHeaders json = new HttpHeaders();
    json.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/google",
            HttpMethod.POST,
            new HttpEntity<>("{\"idToken\":\"" + token + "\"}", json),
            Void.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    return cookie(login);
  }

  private String createStay(
      HttpHeaders session, String title, String description, String latitude, String longitude, String website)
      throws Exception {
    MultiValueMap<String, Object> form = baseForm(title, description, latitude, longitude);
    if (website != null) {
      form.add("website", website);
    }
    ResponseEntity<Map> created =
        http.exchange(
            "/api/v1/host/stays", HttpMethod.POST, new HttpEntity<>(form, session), Map.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    return created.getBody().get("id").toString();
  }

  private MultiValueMap<String, Object> baseForm(
      String title, String description, String latitude, String longitude) throws Exception {
    MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
    form.add("kind", "campsite");
    form.add("title", title);
    form.add("description", description);
    form.add("latitude", latitude);
    form.add("longitude", longitude);
    form.add("images", jpeg());
    return form;
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> host(HttpHeaders session, String id) {
    ResponseEntity<Map> response =
        http.exchange(
            "/api/v1/host/stays/" + id, HttpMethod.GET, new HttpEntity<>(session), Map.class);
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    return response.getBody();
  }

  private String hostStatus(HttpHeaders session, String id) {
    return host(session, id).get("status").toString();
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> me(HttpHeaders session) {
    ResponseEntity<Map> response =
        http.exchange("/api/v1/me", HttpMethod.GET, new HttpEntity<>(session), Map.class);
    return response.getBody();
  }

  private String publicTitles() {
    ResponseEntity<String> response = http.getForEntity("/api/v1/stays", String.class);
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    return response.getBody();
  }

  private static HttpHeaders cookie(ResponseEntity<?> response) {
    HttpHeaders headers = new HttpHeaders();
    String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).isNotBlank();
    headers.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);
    return headers;
  }

  private static String stayText() {
    return "A quiet campsite with pitches for tents. Guests stay overnight beside the lake and wake to birdsong.";
  }

  private static ByteArrayResource jpeg() throws Exception {
    BufferedImage image = new BufferedImage(30, 20, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = image.createGraphics();
    graphics.setColor(Color.ORANGE);
    graphics.fillRect(0, 0, 30, 20);
    graphics.dispose();
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    ImageIO.write(image, "jpg", out);
    return new ByteArrayResource(out.toByteArray()) {
      @Override
      public String getFilename() {
        return "cover.jpg";
      }
    };
  }
}
