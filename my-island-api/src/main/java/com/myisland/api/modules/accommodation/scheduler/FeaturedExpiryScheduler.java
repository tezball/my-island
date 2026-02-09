package com.myisland.api.modules.accommodation.scheduler;

import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class FeaturedExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(FeaturedExpiryScheduler.class);

    private final OwnerRepository ownerRepository;

    public FeaturedExpiryScheduler(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour at minute 0
    @SchedulerLock(name = "expireOwnerFeaturedListings", lockAtLeastFor = "5m")
    @Transactional
    public void expireFeaturedListings() {
        LocalDateTime now = LocalDateTime.now();
        int expiredCount = ownerRepository.expireFeaturedListings(now);

        if (expiredCount > 0) {
            log.info("Expired {} featured listings", expiredCount);
        }
    }
}
