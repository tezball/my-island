package island.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("chaos")
@Testcontainers
class CatalogChaosProfileTest {

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

  @Autowired Environment env;
  @Autowired TestRestTemplate http;

  @Test
  void chaosProfileEnablesLatencyAndExceptionsAndKeepsKillOff() {
    assertThat(env.getActiveProfiles()).contains("chaos", "chaos-monkey");
    assertThat(env.getProperty("chaos.monkey.enabled")).isEqualTo("true");
    assertThat(env.getProperty("chaos.monkey.assaults.latency-active")).isEqualTo("true");
    assertThat(env.getProperty("chaos.monkey.assaults.exceptions-active")).isEqualTo("true");
    assertThat(env.getProperty("chaos.monkey.assaults.kill-application-active")).isEqualTo("false");
  }

  @Test
  void actuatorHealthStaysUpOnChaosProfile() {
    Map<?, ?> body = http.getForObject("/actuator/health", Map.class);
    assertThat(body.get("status")).isEqualTo("UP");
  }
}
