package island.catalog.chaos;

import java.util.function.Supplier;

/** Retry a call, then return the default. Kill-application stays off. */
public final class RetryFallback {

  private RetryFallback() {}

  public static <T> T retryThenDefault(int attempts, Supplier<T> call, T fallback) {
    if (attempts < 1) {
      return fallback;
    }
    for (int i = 0; i < attempts; i++) {
      try {
        return call.get();
      } catch (RuntimeException ex) {
        // next attempt, then the default
      }
    }
    return fallback;
  }
}
