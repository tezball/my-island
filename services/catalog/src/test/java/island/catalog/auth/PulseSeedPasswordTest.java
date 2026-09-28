package island.catalog.auth;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PulseSeedPasswordTest {

  @Test
  void flywaySeedHashMatchesHouseEncoder() throws Exception {
    String sql =
        Files.readString(Path.of("src/main/resources/db/migration/V11__gatling_pulse_seed.sql"));
    Matcher hash = Pattern.compile("\\$2a\\$10\\$[A-Za-z0-9./]{53}").matcher(sql);
    assertThat(hash.find()).isTrue();
    assertThat(new BCryptPasswordEncoder().matches("guest", hash.group())).isTrue();
    assertThat(sql).contains("generate_series(1, 100)");
    assertThat(sql).contains("ON CONFLICT (guest_id, place_id) DO NOTHING");
    assertThat(sql.toLowerCase()).doesNotContain("insert into place");
  }
}
