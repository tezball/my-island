package island.catalog.visit;

import org.flywaydb.core.api.FlywayException;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * V9 and V11 are already applied on databases that stored been, want, and never.
 * Those files now state visited, next, and saved. Repair updates the checksums so
 * Flyway does not re-run them. V12 moves the existing rows.
 */
@Configuration
public class VisitMarkChecksums {

  @Bean
  FlywayMigrationStrategy visitMarkChecksumRepair() {
    return flyway -> {
      try {
        flyway.migrate();
      } catch (FlywayException ex) {
        if (!visitMarkChecksumDrift(ex.getMessage())) {
          throw ex;
        }
        flyway.repair();
        flyway.migrate();
      }
    };
  }

  static boolean visitMarkChecksumDrift(String message) {
    if (message == null) {
      return false;
    }
    String text = message.toLowerCase();
    if (!text.contains("checksum")) {
      return false;
    }
    return text.contains("version 9") || text.contains("version 11");
  }
}
