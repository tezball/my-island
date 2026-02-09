package com.myisland.api.modules.marketplace.scheduler;

import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class SupplierFeaturedExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(SupplierFeaturedExpiryScheduler.class);

    private final SupplierRepository supplierRepository;

    public SupplierFeaturedExpiryScheduler(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour at minute 0
    @SchedulerLock(name = "expireSupplierFeaturedListings", lockAtLeastFor = "5m")
    @Transactional
    public void expireFeaturedListings() {
        LocalDateTime now = LocalDateTime.now();
        int expiredCount = supplierRepository.expireFeaturedListings(now);

        if (expiredCount > 0) {
            log.info("Expired {} supplier featured listings", expiredCount);
        }
    }
}
