package island.catalog.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class PostgisHealthIndicator implements HealthIndicator {

  private final JdbcTemplate jdbc;

  public PostgisHealthIndicator(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Override
  public Health health() {
    try {
      String version = jdbc.queryForObject("select PostGIS_Version()", String.class);
      return Health.up().withDetail("postgis", version).build();
    } catch (Exception ex) {
      return Health.down(ex).build();
    }
  }
}
