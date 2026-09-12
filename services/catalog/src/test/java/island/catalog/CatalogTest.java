package island.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import island.catalog.api.dto.CreatePlaceRequest;
import island.catalog.api.dto.PlaceResponse;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class CatalogTest {

  private static final DockerImageName POSTGIS =
      DockerImageName.parse("ghcr.io/baosystems/postgis:17-3.5")
          .asCompatibleSubstituteFor("postgres");

  @Container
  static final PostgreSQLContainer<?> POSTGRES =
      new PostgreSQLContainer<>(POSTGIS)
          .withDatabaseName("catalog")
          .withUsername("ops")
          .withPassword("ops");

  @DynamicPropertySource
  static void datasource(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", POSTGRES::getUsername);
    registry.add("spring.datasource.password", POSTGRES::getPassword);
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
  void createListGetPlace() {
    CreatePlaceRequest request =
        new CreatePlaceRequest(
            "Skellig Michael",
            "skellig-michael",
            "Monastic island off the Kerry coast.",
            "poi",
            "kerry",
            "Portmagee",
            51.7708,
            -10.5406,
            true,
            "FREE",
            "https://example.test/skellig",
            null,
            null,
            null,
            null,
            null,
            List.of("parking"));
    ResponseEntity<PlaceResponse> created = http.postForEntity("/api/v1/places", request, PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    PlaceResponse body = created.getBody();
    assertThat(body).isNotNull();
    assertThat(body.partnerId()).isNull();
    assertThat(body.category().id()).isEqualTo("poi");
    assertThat(body.county().id()).isEqualTo("kerry");
    assertThat(body.facilities()).containsExactly("parking");
    assertThat(created.getHeaders().getLocation()).isNotNull();

    ResponseEntity<PlaceResponse> byId =
        http.getForEntity("/api/v1/places/" + body.id(), PlaceResponse.class);
    assertThat(byId.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(byId.getBody().slug()).isEqualTo("skellig-michael");

    ResponseEntity<PlaceResponse> bySlug =
        http.getForEntity("/api/v1/places/skellig-michael", PlaceResponse.class);
    assertThat(bySlug.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(bySlug.getBody().id()).isEqualTo(body.id());

    PlaceResponse[] listed = http.getForObject("/api/v1/places?countyId=kerry", PlaceResponse[].class);
    assertThat(listed).extracting(PlaceResponse::slug).contains("skellig-michael");
  }

  @Test
  void unknownPlaceIs404AndUnknownCategoryIs400() {
    ResponseEntity<String> missing =
        http.getForEntity("/api/v1/places/does-not-exist", String.class);
    assertThat(missing.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

    CreatePlaceRequest bad =
        new CreatePlaceRequest(
            "Nope",
            "nope-place",
            null,
            "campsite-only",
            "kerry",
            null,
            null,
            null,
            false,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of());
    ResponseEntity<String> created = http.postForEntity("/api/v1/places", bad, String.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
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
            List.of());
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", request, PlaceResponse.class);
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
            List.of());
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", request, PlaceResponse.class);
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
        http.postForEntity("/api/v1/places", first, PlaceResponse.class);
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
        http.postForEntity("/api/v1/places", second, PlaceResponse.class);
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
            List.of());
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", request, PlaceResponse.class);
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
        http.postForEntity("/api/v1/places", request, PlaceResponse.class);
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
        http.postForEntity("/api/v1/places", again, String.class);
    assertThat(conflict.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(conflict.getBody()).contains("already published");

    PlaceResponse got =
        http.getForObject("/api/v1/places/" + body.id(), PlaceResponse.class);
    assertThat(got.name()).isEqualTo("Published lock");
    assertThat(got.published()).isTrue();
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
        List.of());
  }
}
