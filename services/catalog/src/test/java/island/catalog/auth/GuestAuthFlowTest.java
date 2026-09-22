package island.catalog.auth;

import static org.assertj.core.api.Assertions.assertThat;

import island.catalog.support.CatalogPostgis;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GuestAuthFlowTest {

  @DynamicPropertySource
  static void datasource(DynamicPropertyRegistry registry) {
    CatalogPostgis.datasource(registry);
  }

  @Autowired TestRestTemplate http;
  @Autowired JdbcTemplate jdbc;
  @Autowired MemoryGuestMail mail;

  @Test
  void signupVerifyResetUsesJdbcSessionAndMemoryMail() {
    HttpHeaders json = json();
    ResponseEntity<Void> signup =
        http.exchange(
            "/api/v1/auth/signup",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\"ada\",\"email\":\"ada@example.com\",\"password\":\"password1\"}",
                json),
            Void.class);
    assertThat(signup.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    assertThat(signup.getHeaders().getFirst(HttpHeaders.SET_COOKIE)).contains("SESSION");
    Integer sessions = jdbc.queryForObject("select count(*) from spring_session", Integer.class);
    assertThat(sessions).isNotNull().isPositive();

    HttpHeaders cookie = cookie(signup);
    ResponseEntity<Map> me =
        http.exchange("/api/v1/me", HttpMethod.GET, new HttpEntity<>(cookie), Map.class);
    assertThat(me.getBody()).isNotNull();
    assertThat(me.getBody().get("emailVerified")).isEqualTo(false);

    String verifyToken = tokenFor("ada@example.com", "Verify");
    ResponseEntity<Void> verified =
        http.exchange(
            "/api/auth/verify",
            HttpMethod.POST,
            new HttpEntity<>("{\"token\":\"" + verifyToken + "\"}", json),
            Void.class);
    assertThat(verified.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    ResponseEntity<Map> meVerified =
        http.exchange("/api/v1/me", HttpMethod.GET, new HttpEntity<>(cookie(verified)), Map.class);
    assertThat(meVerified.getBody().get("emailVerified")).isEqualTo(true);

    ResponseEntity<Void> forgot =
        http.exchange(
            "/api/auth/forgot",
            HttpMethod.POST,
            new HttpEntity<>("{\"username\":\"ada@example.com\"}", json),
            Void.class);
    assertThat(forgot.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    String resetToken = tokenFor("ada@example.com", "Reset");
    ResponseEntity<Void> reset =
        http.exchange(
            "/api/v1/auth/reset",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"token\":\"" + resetToken + "\",\"password\":\"password2\"}", json),
            Void.class);
    assertThat(reset.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/login",
            HttpMethod.POST,
            new HttpEntity<>("{\"username\":\"ada\",\"password\":\"password2\"}", json),
            Void.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

    ResponseEntity<String> unknown =
        http.exchange(
            "/api/auth/forgot",
            HttpMethod.POST,
            new HttpEntity<>("{\"username\":\"nobody@example.com\"}", json),
            String.class);
    assertThat(unknown.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

    ResponseEntity<String> duplicate =
        http.exchange(
            "/api/auth/signup",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\"ada\",\"email\":\"other@example.com\",\"password\":\"password1\"}",
                json),
            String.class);
    assertThat(duplicate.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);

    ResponseEntity<String> shortPassword =
        http.exchange(
            "/api/v1/auth/signup",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\"shorty\",\"email\":\"short@example.com\",\"password\":\"short\"}",
                json),
            String.class);
    assertThat(shortPassword.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

    ResponseEntity<String> badToken =
        http.exchange(
            "/api/auth/reset",
            HttpMethod.POST,
            new HttpEntity<>("{\"token\":\"nope\",\"password\":\"password3\"}", json),
            String.class);
    assertThat(badToken.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
  }

  @Test
  void seededPasswordGuestStillLogsIn() {
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/login",
            HttpMethod.POST,
            new HttpEntity<>("{\"username\":\"guest\",\"password\":\"guest\"}", json()),
            Void.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
  }

  private String tokenFor(String email, String subjectPrefix) {
    return mail.sent().stream()
        .filter(sent -> email.equals(sent.to()) && sent.subject().startsWith(subjectPrefix))
        .reduce((first, second) -> second)
        .map(GuestMail.Sent::text)
        .map(GuestAuthFlowTest::tokenFrom)
        .orElseThrow();
  }

  private static String tokenFrom(String text) {
    int at = text.indexOf("token=");
    assertThat(at).isGreaterThan(0);
    String token = text.substring(at + "token=".length()).trim();
    int space = token.indexOf(' ');
    return space < 0 ? token : token.substring(0, space);
  }

  private static HttpHeaders json() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return headers;
  }

  private static HttpHeaders cookie(ResponseEntity<?> response) {
    HttpHeaders headers = new HttpHeaders();
    String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).isNotBlank();
    headers.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);
    return headers;
  }
}
