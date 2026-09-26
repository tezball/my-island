package island.catalog.chaos;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;

class RetryFallbackTest {

  @Test
  void retriesThenReturnsDefault() {
    AtomicInteger calls = new AtomicInteger();
    String value =
        RetryFallback.retryThenDefault(
            3,
            () -> {
              calls.incrementAndGet();
              throw new IllegalStateException("down");
            },
            "fallback");
    assertThat(calls).hasValue(3);
    assertThat(value).isEqualTo("fallback");
  }

  @Test
  void returnsFirstSuccessWithoutUsingFallback() {
    AtomicInteger calls = new AtomicInteger();
    String value =
        RetryFallback.retryThenDefault(
            3,
            () -> {
              if (calls.incrementAndGet() < 2) {
                throw new IllegalStateException("down");
              }
              return "ok";
            },
            "fallback");
    assertThat(value).isEqualTo("ok");
    assertThat(calls).hasValue(2);
  }

  @Test
  void chaosProfileKeepsKillApplicationOff() throws Exception {
    String chaos = Files.readString(Path.of("src/main/resources/application-chaos.yml"));
    assertThat(chaos).contains("enabled: true");
    assertThat(chaos).contains("kill-application-active: false");
  }
}
