package com.myisland.api.shared.scheduling;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
public class TrialExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(TrialExpiryScheduler.class);

    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;

    public TrialExpiryScheduler(OwnerRepository ownerRepository, SupplierRepository supplierRepository) {
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
    }

    @Scheduled(fixedRate = 3600000) // every hour
    @Transactional
    public void expireTrials() {
        Instant now = Instant.now();

        List<Owner> expiredOwners = ownerRepository
                .findBySubscriptionStatusAndTrialEndsAtBefore(Owner.SubscriptionStatus.TRIALING, now);
        for (Owner owner : expiredOwners) {
            owner.setSubscriptionStatus(Owner.SubscriptionStatus.NONE);
            log.info("Trial expired for owner id={}", owner.getId());
        }
        if (!expiredOwners.isEmpty()) {
            ownerRepository.saveAll(expiredOwners);
        }

        List<Supplier> expiredSuppliers = supplierRepository
                .findBySubscriptionStatusAndTrialEndsAtBefore(Supplier.SubscriptionStatus.TRIALING, now);
        for (Supplier supplier : expiredSuppliers) {
            supplier.setSubscriptionStatus(Supplier.SubscriptionStatus.NONE);
            log.info("Trial expired for supplier id={}", supplier.getId());
        }
        if (!expiredSuppliers.isEmpty()) {
            supplierRepository.saveAll(expiredSuppliers);
        }
    }
}
