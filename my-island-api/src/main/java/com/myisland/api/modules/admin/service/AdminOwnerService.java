package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminOwnerService {

    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;
    private final AdminAuditService adminAuditService;

    public AdminOwnerService(OwnerRepository ownerRepository, UserRepository userRepository, AdminAuditService adminAuditService) {
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
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
    public Map<String, Object> createOwner(Long adminUserId, Long userId, String propertyName, String county,
            String town, String propertyType, String description, String phone, String website,
            BigDecimal latitude, BigDecimal longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (ownerRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("User is already an owner");
        }

        Owner owner = Owner.builder()
                .user(user)
                .propertyName(propertyName)
                .county(county)
                .town(town)
                .propertyType(propertyType != null ? Owner.PropertyType.valueOf(propertyType) : Owner.PropertyType.TOURING)
                .description(description)
                .phone(phone)
                .website(website)
                .latitude(latitude)
                .longitude(longitude)
                .build();

        Owner saved = ownerRepository.save(owner);

        user.setOwner(true);
        userRepository.save(user);

        adminAuditService.log(
                adminUserId,
                "CREATE_OWNER",
                "OWNER",
                saved.getId(),
                "Created owner: " + propertyName + " for user: " + user.getEmail(),
                null,
                null
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> updateOwner(Long adminUserId, Long ownerId, String propertyName, String county,
            String town, String propertyType, String description, String phone, String website,
            BigDecimal latitude, BigDecimal longitude) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));

        if (propertyName != null) owner.setPropertyName(propertyName);
        if (county != null) owner.setCounty(county);
        if (town != null) owner.setTown(town);
        if (propertyType != null) owner.setPropertyType(Owner.PropertyType.valueOf(propertyType));
        if (description != null) owner.setDescription(description);
        if (phone != null) owner.setPhone(phone);
        if (website != null) owner.setWebsite(website);
        if (latitude != null) owner.setLatitude(latitude);
        if (longitude != null) owner.setLongitude(longitude);

        Owner saved = ownerRepository.save(owner);

        adminAuditService.log(
                adminUserId,
                "UPDATE_OWNER",
                "OWNER",
                ownerId,
                "Updated owner: " + owner.getPropertyName(),
                null,
                null
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> toggleDeactivated(Long adminUserId, Long ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));

        boolean previous = owner.isDeactivated();
        owner.setDeactivated(!previous);

        Owner saved = ownerRepository.save(owner);

        adminAuditService.log(
                adminUserId,
                "TOGGLE_OWNER_DEACTIVATED",
                "OWNER",
                ownerId,
                (saved.isDeactivated() ? "Deactivated" : "Reactivated") + " owner: " + owner.getPropertyName(),
                null,
                null
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
        dto.put("phone", owner.getPhone());
        dto.put("website", owner.getWebsite());
        dto.put("latitude", owner.getLatitude());
        dto.put("longitude", owner.getLongitude());
        dto.put("subscriptionStatus", owner.getSubscriptionStatus() != null ? owner.getSubscriptionStatus().name() : "NONE");
        dto.put("rating", owner.getRating());
        dto.put("reviewCount", owner.getReviewCount());
        dto.put("lotCount", owner.getLots() != null ? owner.getLots().size() : 0);
        dto.put("isFeatured", owner.isFeatured());
        dto.put("isDeactivated", owner.isDeactivated());
        dto.put("createdAt", owner.getCreatedAt() != null ? owner.getCreatedAt().toString() : null);
        return dto;
    }
}
