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
      DockerImageName.parse("postgis/postgis:17-3.5-alpine").asCompatibleSubstituteFor("postgres");

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
    assertThat(columns)
        .doesNotContain(
            "availability",
            "inventory",
            "calendar",
            "live_rate",
            "stripe_id",
            "stripe",
            "rate");
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
            "Nope", "nope-place", null, "campsite-only", "kerry", null, null, null, false, null, null,
            null, List.of());
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
            List.of());
    ResponseEntity<PlaceResponse> created =
        http.postForEntity("/api/v1/places", request, PlaceResponse.class);
    assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    return created.getBody();
  }
}
