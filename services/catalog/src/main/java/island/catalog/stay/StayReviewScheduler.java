package island.catalog.stay;

import jakarta.annotation.PreDestroy;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class StayReviewScheduler {

  private static final Logger log = LoggerFactory.getLogger(StayReviewScheduler.class);

  private final StayProperties properties;
  private final StayService stays;
  private final ScheduledExecutorService pool;

  public StayReviewScheduler(StayProperties properties, StayService stays) {
    this.properties = properties;
    this.stays = stays;
    this.pool =
        Executors.newSingleThreadScheduledExecutor(
            runnable -> {
              Thread thread = new Thread(runnable, "stay-review");
              thread.setDaemon(true);
              return thread;
            });
  }

  public void schedule(UUID id) {
    if (!properties.autoReview()) {
      return;
    }
    long delay = Math.max(0, properties.reviewDelayMs());
    pool.schedule(
        () -> {
          try {
            stays.reviewNow(id);
          } catch (Exception ex) {
            log.warn("Stay review error id={} — Stay stays hidden", id, ex);
          }
        },
        delay,
        TimeUnit.MILLISECONDS);
  }

  @PreDestroy
  void shutdown() {
    pool.shutdownNow();
  }
}
