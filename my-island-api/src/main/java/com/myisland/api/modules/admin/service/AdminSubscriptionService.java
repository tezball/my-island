package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminSubscriptionService {

    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;

    public AdminSubscriptionService(OwnerRepository ownerRepository, SupplierRepository supplierRepository) {
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getOverview() {
        Map<String, Object> overview = new HashMap<>();

        Map<String, Long> ownersByStatus = new HashMap<>();
        for (Owner.SubscriptionStatus status : Owner.SubscriptionStatus.values()) {
            long count = ownerRepository.findAll().stream()
                    .filter(o -> o.getSubscriptionStatus() == status)
                    .count();
            ownersByStatus.put(status.name(), count);
        }
        overview.put("ownersByStatus", ownersByStatus);

        Map<String, Long> suppliersByStatus = new HashMap<>();
        for (Supplier.SubscriptionStatus status : Supplier.SubscriptionStatus.values()) {
            long count = supplierRepository.findAll().stream()
                    .filter(s -> s.getSubscriptionStatus() == status)
                    .count();
            suppliersByStatus.put(status.name(), count);
        }
        overview.put("suppliersByStatus", suppliersByStatus);

        return overview;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listSubscriptions(String entityType, int page, int size) {
        List<Map<String, Object>> subscriptions = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        boolean includeOwners = entityType == null || entityType.isBlank() || "OWNER".equalsIgnoreCase(entityType);
        boolean includeSuppliers = entityType == null || entityType.isBlank() || "SUPPLIER".equalsIgnoreCase(entityType);

        if (includeOwners) {
            Page<Owner> owners = ownerRepository.findAll(pageRequest);
            owners.forEach(owner -> {
                Map<String, Object> sub = new HashMap<>();
                sub.put("id", owner.getId());
                sub.put("type", "OWNER");
                sub.put("name", owner.getPropertyName());
                sub.put("userId", owner.getUser().getId());
                sub.put("userEmail", owner.getUser().getEmail());
                sub.put("subscriptionStatus", owner.getSubscriptionStatus() != null ? owner.getSubscriptionStatus().name() : "NONE");
                subscriptions.add(sub);
            });
        }
        if (includeSuppliers) {
            Page<Supplier> suppliers = supplierRepository.findAll(pageRequest);
            suppliers.forEach(supplier -> {
                Map<String, Object> sub = new HashMap<>();
                sub.put("id", supplier.getId());
                sub.put("type", "SUPPLIER");
                sub.put("name", supplier.getBusinessName());
                sub.put("userId", supplier.getUser().getId());
                sub.put("userEmail", supplier.getUser().getEmail());
                sub.put("subscriptionStatus", supplier.getSubscriptionStatus() != null ? supplier.getSubscriptionStatus().name() : "NONE");
                subscriptions.add(sub);
            });
        }

        return subscriptions;
    }
}
