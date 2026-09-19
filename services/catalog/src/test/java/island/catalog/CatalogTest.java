package island.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import island.catalog.api.dto.CreatePlaceRequest;
import island.catalog.api.dto.PlaceResponse;
import island.catalog.auth.ImportKeyFilter;
import island.catalog.support.CatalogPostgis;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.env.Environment;
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
class CatalogTest {

  @DynamicPropertySource
  static void datasource(DynamicPropertyRegistry registry) {
    CatalogPostgis.datasource(registry);
    registry.add("GIT_COMMIT", () -> "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    registry.add("GIT_COMMIT_SHORT", () -> "aaaaaaaaaaaa");
    registry.add("GIT_BRANCH", () -> "main");
    registry.add("APP_VERSION", () -> "0.0.1-SNAPSHOT");
    registry.add("APP_BUILD_TIME", () -> "2026-09-13T00:00:00Z");
  }

  @Autowired TestRestTemplate http;
  @Autowired JdbcTemplate jdbc;
  @Autowired Environment env;

  @Test
  void healthReportsPostgis() {
    Map<?, ?> body = http.getForObject("/actuator/health", Map.class);
    assertThat(body.get("status")).isEqualTo("UP");
    assertThat(body.toString()).contains("postgis");
  }

  @Test
  void prometheusIsScrapable() {
    String body = http.getForObject("/actuator/prometheus", String.class);
    assertThat(body).contains("jvm_memory_used_bytes");
  }

  @Test
  void infoReportsVersionAndGitCommit() {
    Map<?, ?> body = http.getForObject("/actuator/info", Map.class);
    assertThat(body).isNotNull();
    assertThat(body.get("app")).isInstanceOf(Map.class);
    Map<?, ?> app = (Map<?, ?>) body.get("app");
    assertThat(app.get("service")).isEqualTo("catalog");
    assertThat(app.get("version")).isEqualTo("0.0.1-SNAPSHOT");
    assertThat(app.get("gitCommit")).isEqualTo("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    assertThat(app.get("gitCommitShort")).isEqualTo("aaaaaaaaaaaa");
    assertThat(app.get("gitBranch")).isEqualTo("main");
    assertThat(app.get("buildTime")).isEqualTo("2026-09-13T00:00:00Z");
  }

  @Test
  void logsAreStructuredJson() {
    assertThat(env.getProperty("logging.structured.format.console")).isEqualTo("logstash");
  }

  @Test
  void countiesAreDataIncludingNi() {
    Integer count = jdbc.queryForObject("select count(*) from county", Integer.class);
    Integer ni = jdbc.queryForObject("select count(*) from county where ni", Integer.class);
    assertThat(count).isEqualTo(32);
    assertThat(ni).isEqualTo(6);
    List<String> niIds =
        jdbc.queryForList("select id from county where ni order by id", String.class);
    assertThat(niIds)
        .containsExactly("antrim", "armagh", "derry", "down", "fermanagh", "tyrone");
  }

  @Test
  void categoriesAndFacilitiesAreRows() {
    List<String> categories =
        jdbc.queryForList("select id from category order by sort_order", String.class);
    assertThat(categories).containsExactly("poi", "experience", "campsite", "bnb");
    Integer facilities = jdbc.queryForObject("select count(*) from facility", Integer.class);
    assertThat(facilities).isGreaterThanOrEqualTo(4);
  }

  @Test
  void placeHasPartnerIdSeamAndNoBookingColumns() {
    List<String> columns =
        jdbc.queryForList(
            """
            select column_name from information_schema.columns
            where table_schema = 'public' and table_name = 'place'
            """,
            String.class);
    assertThat(columns).contains("partner_id");
    assertThat(columns).contains("source_url", "source_name", "licence", "lead_dedupe_key");
    assertThat(columns).contains("image_url", "image_credit", "image_licence");
    assertThat(columns)
        .doesNotContain(
            "availability",
            "inventory",
            "calendar",
            "live_rate",
            "stripe_id",
            "stripe",
            "rate",
            "country");
  }

  @Test
  void noCountryTable() {
    Integer tables =
        jdbc.queryForObject(
            """
            select count(*) from information_schema.tables
            where table_schema = 'public' and table_name = 'country'
            """,
            Integer.class);
    assertThat(tables).isZero();
    Integer enums =
        jdbc.queryForObject(
            """
            select count(*) from pg_type t
            join pg_namespace n on n.oid = t.typnamespace
            where n.nspname = 'public' and t.typname = 'country'
            """,
            Integer.class);
    assertThat(enums).isZero();
  }

  @Test
  void chaosMonkeyIsOffByDefault() {
    assertThat(env.getProperty("chaos.monkey.enabled")).isEqualTo("false");
    assertThat(env.getActiveProfiles()).doesNotContain("chaos", "chaos-monkey");
  }

  @Test
  void lookupsMatchSeeds() {
    var categories = http.getForObject("/api/v1/categories", List.class);
    var counties = http.getForObject("/api/v1/counties", List.class);
    assertThat(categories).hasSize(4);
    assertThat(counties).hasSize(32);
  }

  @Test
  void locationIsWrittenAsPostgisPoint() {
    PlaceResponse place = createSample("postgis-point-place");
    Integer dim =
        jdbc.queryForObject(
            "select ST_Dimension(location::geometry) from place where id = ?",
            Integer.class,
            place.id());
    assertThat(dim).isEqualTo(0);
    Double lon =
        jdbc.queryForObject(
            "select ST_X(location::geometry) from place where id = ?", Double.class, place.id());
    assertThat(lon).isEqualTo(place.longitude());
  }

  @Test
  void meUnauthorizedWithoutSession() {
    ResponseEntity<String> me = http.getForEntity("/api/v1/me", String.class);
    assertThat(me.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void googleLoginSessionAndLogout() {
    String token = "stub:google-user-99:visitor@example.com:Visitor Name";
    HttpHeaders json = new HttpHeaders();
    json.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/google",
            HttpMethod.POST,
            new HttpEntity<>("{\"idToken\":\"" + token + "\"}", json),
            Void.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

    HttpHeaders withCookie = new HttpHeaders();
    String setCookie = login.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).isNotBlank();
    withCookie.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);

    ResponseEntity<Map> me =
        http.exchange("/api/v1/me", HttpMethod.GET, new HttpEntity<>(withCookie), Map.class);
    assertThat(me.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(me.getBody()).isNotNull();
    assertThat(me.getBody().get("email")).isEqualTo("visitor@example.com");
    assertThat(me.getBody().get("displayName")).isEqualTo("Visitor Name");
    assertThat(me.getBody().get("id")).isNotNull();

    Integer users =
        jdbc.queryForObject(
            "select count(*) from app_user where email = ?", Integer.class, "visitor@example.com");
    assertThat(users).isEqualTo(1);
    Integer identities =
        jdbc.queryForObject(
            "select count(*) from user_identity where issuer = 'google' and subject = ?",
            Integer.class,
            "google-user-99");
    assertThat(identities).isEqualTo(1);

    ResponseEntity<Void> logout =
        http.exchange(
            "/api/auth/logout", HttpMethod.POST, new HttpEntity<>(withCookie), Void.class);
    assertThat(logout.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    ResponseEntity<String> meAfterLogout =
        http.exchange("/api/v1/me", HttpMethod.GET, new HttpEntity<>(withCookie), String.class);
    assertThat(meAfterLogout.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void googleLoginRejectsNonStubWhenStubEnabled() {
    HttpHeaders json = new HttpHeaders();
    json.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<String> login =
        http.exchange(
            "/api/auth/google",
            HttpMethod.POST,
            new HttpEntity<>("{\"idToken\":\"not-a-google-jwt\"}", json),
            String.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
  }

  private PlaceResponse createSample(String slug) {
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            slug,
            slug,
            "stub",
            "campsite",
            "antrim",
            "Cushendall",
            55.13,
            -6.06,
            false,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(),
            null,
            null,
            null);
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", new HttpEntity<>(request, importHeaders()), PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    return created.getBody();
  }

  @Test
  void provenancePersistsOnCreate() {
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            "Provenance campsite",
            "provenance-campsite",
            null,
            "campsite",
            "antrim",
            null,
            55.13,
            -6.06,
            true,
            null,
            "https://example.test/camp",
            "+44 28 0000",
            "https://example.test/source",
            "example.test",
            "internal-research",
            null,
            List.of(),
            null,
            null,
            null);
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", new HttpEntity<>(request, importHeaders()), PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    PlaceResponse body = created.getBody();
    assertThat(body).isNotNull();
    assertThat(body.sourceUrl()).isEqualTo("https://example.test/source");
    assertThat(body.sourceName()).isEqualTo("example.test");
    assertThat(body.licence()).isEqualTo("internal-research");
    assertThat(body.leadDedupeKey()).isNull();
    assertThat(body.published()).isTrue();

    PlaceResponse got =
        http.getForObject("/api/v1/places/" + body.id(), PlaceResponse.class);
    assertThat(got.sourceUrl()).isEqualTo("https://example.test/source");
    assertThat(got.sourceName()).isEqualTo("example.test");
    assertThat(got.licence()).isEqualTo("internal-research");
  }

  @Test
  void leadDedupeKeyUpsertsUnpublishedDraftAndHidesFromPublishedList() {
    CreatePlaceRequest first =
        leadDraft(
            "Draft A",
            "lead-draft-a",
            "campsite:antrim:lead-draft-a",
            "https://example.test/a");
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", new HttpEntity<>(first, importHeaders()), PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    PlaceResponse original = created.getBody();
    assertThat(original).isNotNull();
    assertThat(original.published()).isFalse();
    assertThat(original.leadDedupeKey()).isEqualTo("campsite:antrim:lead-draft-a");
    assertThat(original.slug()).isEqualTo("lead-draft-a");

    PlaceResponse[] published =
        http.getForObject("/api/v1/places?published=true", PlaceResponse[].class);
    assertThat(published).extracting(PlaceResponse::id).doesNotContain(original.id());

    CreatePlaceRequest second =
        leadDraft(
            "Draft B",
            "lead-draft-b-ignored-slug",
            "campsite:antrim:lead-draft-a",
            "https://example.test/b");
    ResponseEntity<PlaceResponse> updated =
        http.postForEntity("/api/v1/places", new HttpEntity<>(second, importHeaders()), PlaceResponse.class);
    assertThat(updated.getStatusCode()).isEqualTo(HttpStatus.OK);
    PlaceResponse body = updated.getBody();
    assertThat(body).isNotNull();
    assertThat(body.id()).isEqualTo(original.id());
    assertThat(body.slug()).isEqualTo("lead-draft-a");
    assertThat(body.name()).isEqualTo("Draft B");
    assertThat(body.sourceUrl()).isEqualTo("https://example.test/b");
    assertThat(body.published()).isFalse();

    Integer rows =
        jdbc.queryForObject(
            "select count(*) from place where lead_dedupe_key = ?",
            Integer.class,
            "campsite:antrim:lead-draft-a");
    assertThat(rows).isEqualTo(1);
  }

  @Test
  void leadDedupeKeyForcesUnpublishedEvenWhenBodySaysTrue() {
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            "Forced draft",
            "forced-draft",
            null,
            "campsite",
            "down",
            null,
            null,
            null,
            true,
            null,
            null,
            null,
            "https://example.test/forced",
            "example.test",
            "internal-research",
            "campsite:down:forced-draft",
            List.of(),
            null,
            null,
            null);
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", new HttpEntity<>(request, importHeaders()), PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(created.getBody()).isNotNull();
    assertThat(created.getBody().published()).isFalse();
  }

  @Test
  void publishedLeadDedupeKeyConflictsWith409() {
    CreatePlaceRequest request =
        leadDraft(
            "Published lock",
            "published-lock",
            "campsite:tyrone:published-lock",
            "https://example.test/lock");
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", new HttpEntity<>(request, importHeaders()), PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    PlaceResponse body = created.getBody();
    assertThat(body).isNotNull();
    jdbc.update("update place set published = true where id = ?", body.id());

    CreatePlaceRequest again =
        leadDraft(
            "Should not overwrite",
            "published-lock-2",
            "campsite:tyrone:published-lock",
            "https://example.test/lock-2");
    ResponseEntity<String> conflict =
        http.postForEntity("/api/v1/places", new HttpEntity<>(again, importHeaders()), String.class);
    assertThat(conflict.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(conflict.getBody()).contains("already published");

    PlaceResponse got =
        http.getForObject("/api/v1/places/" + body.id(), PlaceResponse.class);
    assertThat(got.name()).isEqualTo("Published lock");
    assertThat(got.published()).isTrue();
  }

  @Test
  void imageFieldsRoundTripOnCreate() {
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            "Hook Lighthouse",
            "hook-lighthouse-test",
            "Working medieval light on the Hook.",
            "poi",
            "wexford",
            "Hook Head",
            52.1236,
            -6.9294,
            true,
            "1",
            "https://example.test/hook",
            null,
            "https://www.wikidata.org/wiki/Q1627900",
            "Wikidata",
            "CC0",
            null,
            List.of("parking"),
            "https://example.test/hook.jpg",
            "Example Photographer",
            "CC BY-SA 4.0");
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", new HttpEntity<>(request, importHeaders()), PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    PlaceResponse body = created.getBody();
    assertThat(body).isNotNull();
    assertThat(body.imageUrl()).isEqualTo("https://example.test/hook.jpg");
    assertThat(body.imageCredit()).isEqualTo("Example Photographer");
    assertThat(body.imageLicence()).isEqualTo("CC BY-SA 4.0");
    PlaceResponse got = http.getForObject("/api/v1/places/hook-lighthouse-test", PlaceResponse.class);
    assertThat(got.imageUrl()).isEqualTo("https://example.test/hook.jpg");
    assertThat(got.imageCredit()).isEqualTo("Example Photographer");
    assertThat(got.imageLicence()).isEqualTo("CC BY-SA 4.0");
  }

  private static CreatePlaceRequest leadDraft(
      String name, String slug, String leadDedupeKey, String sourceUrl) {
    return new CreatePlaceRequest(
        name,
        slug,
        null,
        "campsite",
        "antrim",
        null,
        54.6,
        -6.2,
        true,
        null,
        "https://example.test",
        "+44 28 1111",
        sourceUrl,
        "example.test",
        "internal-research",
        leadDedupeKey,
        List.of(),
        null,
        null,
        null);
  }

  @Test
  void anonymousPlacePostIsRejectedWithoutImportKey() {
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            "Public write blocked",
            "public-write-blocked",
            null,
            "poi",
            "kerry",
            null,
            51.9,
            -9.5,
            true,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(),
            null,
            null,
            null);
    ResponseEntity<String> created = http.postForEntity("/api/v1/places", request, String.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
  }

  @Test
  void guestSessionCannotWritePlaces() {
    HttpHeaders cookie = passwordLogin("guest", "guest");
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            "Guest write blocked",
            "guest-write-blocked",
            null,
            "poi",
            "kerry",
            null,
            51.9,
            -9.5,
            true,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(),
            null,
            null,
            null);
    ResponseEntity<String> created =
        http.exchange(
            "/api/v1/places",
            HttpMethod.POST,
            new HttpEntity<>(request, cookie),
            String.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
  }

  @Test
  void passwordGuestVisitIntentUpsertPrivateListAndBeenCount() {
    PlaceResponse place = createSample("visit-intent-place");
    assertThat(place.beenCount()).isZero();

    HttpHeaders guest = passwordLogin("guest", "guest");
    ResponseEntity<Map> put =
        http.exchange(
            "/api/v1/me/places/" + place.id() + "/visit-intent",
            HttpMethod.PUT,
            new HttpEntity<>("{\"mark\":\"been\"}", jsonPlus(guest)),
            Map.class);
    assertThat(put.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(put.getBody()).isNotNull();
    assertThat(put.getBody().get("mark")).isEqualTo("been");

    ResponseEntity<Map> replace =
        http.exchange(
            "/api/v1/me/places/" + place.id() + "/visit-intent",
            HttpMethod.PUT,
            new HttpEntity<>("{\"mark\":\"want\"}", jsonPlus(guest)),
            Map.class);
    assertThat(replace.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(replace.getBody().get("mark")).isEqualTo("want");

    Integer unique =
        jdbc.queryForObject(
            "select count(*) from visit_intent where guest_id = (select id from app_user where username = 'guest') and place_id = ?",
            Integer.class,
            place.id());
    assertThat(unique).isEqualTo(1);
    Integer audits =
        jdbc.queryForObject(
            "select count(*) from visit_intent_audit where place_id = ?",
            Integer.class,
            place.id());
    assertThat(audits).isGreaterThanOrEqualTo(2);

    PlaceResponse afterWant = http.getForObject("/api/v1/places/" + place.id(), PlaceResponse.class);
    assertThat(afterWant.beenCount()).isZero();
    assertThat(afterWant.toString()).doesNotContain("want");

    http.exchange(
        "/api/v1/me/places/" + place.id() + "/visit-intent",
        HttpMethod.PUT,
        new HttpEntity<>("{\"mark\":\"been\"}", jsonPlus(guest)),
        Map.class);
    PlaceResponse afterBeen = http.getForObject("/api/v1/places/" + place.id(), PlaceResponse.class);
    assertThat(afterBeen.beenCount()).isEqualTo(1);

    ResponseEntity<List> privateList =
        http.exchange(
            "/api/v1/me/visit-intents?mark=been",
            HttpMethod.GET,
            new HttpEntity<>(guest),
            List.class);
    assertThat(privateList.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(privateList.getBody()).isNotEmpty();

    ResponseEntity<String> anonList =
        http.getForEntity("/api/v1/me/visit-intents", String.class);
    assertThat(anonList.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

    String token = "stub:other-guest:other@example.com:Other";
    HttpHeaders other = googleLogin(token);
    ResponseEntity<List> otherList =
        http.exchange(
            "/api/v1/me/visit-intents?mark=been",
            HttpMethod.GET,
            new HttpEntity<>(other),
            List.class);
    assertThat(otherList.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(otherList.getBody()).isEmpty();
  }

  @Test
  void visitIntentAnonymousWriteIsUnauthorized() {
    PlaceResponse place = createSample("anon-tick-blocked");
    ResponseEntity<String> put =
        http.exchange(
            "/api/v1/me/places/" + place.id() + "/visit-intent",
            HttpMethod.PUT,
            new HttpEntity<>("{\"mark\":\"been\"}", jsonHeaders()),
            String.class);
    assertThat(put.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
  }

  private static HttpHeaders importHeaders() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set(ImportKeyFilter.HEADER, "test-import-key");
    return headers;
  }

  private static HttpHeaders jsonHeaders() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return headers;
  }

  private static HttpHeaders jsonPlus(HttpHeaders cookie) {
    HttpHeaders headers = new HttpHeaders();
    headers.putAll(cookie);
    headers.setContentType(MediaType.APPLICATION_JSON);
    return headers;
  }

  private HttpHeaders passwordLogin(String username, String password) {
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/login",
            HttpMethod.POST,
            new HttpEntity<>(
                "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}",
                jsonHeaders()),
            Void.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    return cookieHeaders(login);
  }

  private HttpHeaders googleLogin(String token) {
    ResponseEntity<Void> login =
        http.exchange(
            "/api/auth/google",
            HttpMethod.POST,
            new HttpEntity<>("{\"idToken\":\"" + token + "\"}", jsonHeaders()),
            Void.class);
    assertThat(login.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    return cookieHeaders(login);
  }

  private static HttpHeaders cookieHeaders(ResponseEntity<?> login) {
    HttpHeaders withCookie = new HttpHeaders();
    String setCookie = login.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).isNotBlank();
    withCookie.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);
    return withCookie;
  }
}
