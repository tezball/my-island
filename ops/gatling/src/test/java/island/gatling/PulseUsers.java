package island.gatling;

import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

/** Flyway seed {@code pulse-001}..{@code pulse-100}. Test password is {@code guest}. */
public final class PulseUsers {

  static final int POOL = 100;
  static final int TRICKLE = 10;
  static final String PASSWORD = "guest";

  private PulseUsers() {}

  static String username(int n) {
    return String.format("pulse-%03d", n);
  }

  static List<Map<String, Object>> records(int count) {
    return IntStream.rangeClosed(1, count)
        .mapToObj(
            n -> Map.<String, Object>of("username", username(n), "password", PASSWORD))
        .toList();
  }
}
