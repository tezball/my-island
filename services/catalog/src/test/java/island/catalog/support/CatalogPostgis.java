package island.catalog.support;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

/** Shared PostGIS for JUnit and Gherkin contract tests (one container per JVM). */
public final class CatalogPostgis {

  public static final String IMAGE = "ghcr.io/baosystems/postgis:17-3.5";

  public static final PostgreSQLContainer<?> POSTGRES =
      new PostgreSQLContainer<>(
              DockerImageName.parse(IMAGE).asCompatibleSubstituteFor("postgres"))
          .withDatabaseName("catalog")
          .withUsername("ops")
          .withPassword("ops");

  static {
    POSTGRES.start();
  }

  private CatalogPostgis() {}

  public static void datasource(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", POSTGRES::getUsername);
    registry.add("spring.datasource.password", POSTGRES::getPassword);
    registry.add("catalog.import.key", () -> "test-import-key");
    registry.add("catalog.auth.google.stub-enabled", () -> "true");
    registry.add("catalog.seed.guest.username", () -> "guest");
    registry.add("catalog.seed.guest.password", () -> "guest");
    registry.add("catalog.seed.guest.email", () -> "guest@local.test");
    registry.add("catalog.mail.mode", () -> "memory");
    registry.add("catalog.mail.from", () -> "noreply@localhost");
    registry.add("catalog.mail.public-origin", () -> "http://localhost:5173");
    registry.add("google.client-id", () -> "test.apps.googleusercontent.com");
    registry.add("google.client-secret", () -> "test-secret");
  }
}
