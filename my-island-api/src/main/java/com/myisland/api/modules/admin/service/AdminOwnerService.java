package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminOwnerService {

    private final OwnerRepository ownerRepository;
    private final AdminAuditService adminAuditService;

    public AdminOwnerService(OwnerRepository ownerRepository, AdminAuditService adminAuditService) {
        this.ownerRepository = ownerRepository;
        this.adminAuditService = adminAuditService;
    }

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> listOwners(String subscriptionStatus, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Owner> owners = ownerRepository.findAll(pageRequest);
        return owners.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getOwner(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + id));
        return toDto(owner);
    }

    @Transactional
    public Map<String, Object> updateOwner(Long adminUserId, Long ownerId, String propertyName, String county, String description) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));

        String previousValue = String.format("propertyName=%s, county=%s, description=%s",
                owner.getPropertyName(), owner.getCounty(), owner.getDescription());

        if (propertyName != null) {
            owner.setPropertyName(propertyName);
        }
        if (county != null) {
            owner.setCounty(county);
        }
        if (description != null) {
            owner.setDescription(description);
        }

        Owner saved = ownerRepository.save(owner);

        String newValue = String.format("propertyName=%s, county=%s, description=%s",
                saved.getPropertyName(), saved.getCounty(), saved.getDescription());

        adminAuditService.log(
                adminUserId,
                "UPDATE_OWNER",
                "OWNER",
                ownerId,
                "Updated owner: " + owner.getPropertyName(),
                previousValue,
                newValue
        );

        return toDto(saved);
    }

    private Map<String, Object> toDto(Owner owner) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", owner.getId());
        dto.put("userId", owner.getUser().getId());
        dto.put("userEmail", owner.getUser().getEmail());
        dto.put("userName", owner.getUser().getName());
        dto.put("propertyName", owner.getPropertyName());
        dto.put("county", owner.getCounty());
        dto.put("town", owner.getTown());
        dto.put("propertyType", owner.getPropertyType() != null ? owner.getPropertyType().name() : null);
        dto.put("description", owner.getDescription());
        dto.put("subscriptionStatus", owner.getSubscriptionStatus() != null ? owner.getSubscriptionStatus().name() : "NONE");
        dto.put("rating", owner.getRating());
        dto.put("reviewCount", owner.getReviewCount());
        dto.put("lotCount", owner.getLots() != null ? owner.getLots().size() : 0);
        dto.put("isFeatured", owner.isFeatured());
        dto.put("createdAt", owner.getCreatedAt() != null ? owner.getCreatedAt().toString() : null);
        return dto;
    }
}
