package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminSupplierService {

    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final AdminAuditService adminAuditService;

    public AdminSupplierService(SupplierRepository supplierRepository, UserRepository userRepository, AdminAuditService adminAuditService) {
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.adminAuditService = adminAuditService;
    }

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> listSuppliers(String category, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Supplier> suppliers = supplierRepository.findAll(pageRequest);
        return suppliers.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return toDto(supplier);
    }

    @Transactional
    public Map<String, Object> createSupplier(Long adminUserId, Long userId, String businessName, String county,
            String town, String address, String category, String description, String phone, String website,
            Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (supplierRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("User is already a supplier");
        }

        Supplier supplier = Supplier.builder()
                .user(user)
                .businessName(businessName)
                .county(county)
                .town(town)
                .address(address)
                .category(category != null ? Supplier.SupplierCategory.valueOf(category) : Supplier.SupplierCategory.OTHER)
                .description(description)
                .phone(phone)
                .website(website)
                .latitude(latitude)
                .longitude(longitude)
                .build();

        Supplier saved = supplierRepository.save(supplier);

        user.setSupplier(true);
        userRepository.save(user);

        adminAuditService.log(
                adminUserId,
                "CREATE_SUPPLIER",
                "SUPPLIER",
                saved.getId(),
                "Created supplier: " + businessName + " for user: " + user.getEmail(),
                null,
                null
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> updateSupplier(Long adminUserId, Long supplierId, String businessName, String county,
            String town, String address, String category, String description, String phone, String website,
            Double latitude, Double longitude) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        if (businessName != null) supplier.setBusinessName(businessName);
        if (county != null) supplier.setCounty(county);
        if (town != null) supplier.setTown(town);
        if (address != null) supplier.setAddress(address);
        if (category != null) supplier.setCategory(Supplier.SupplierCategory.valueOf(category));
        if (description != null) supplier.setDescription(description);
        if (phone != null) supplier.setPhone(phone);
        if (website != null) supplier.setWebsite(website);
        if (latitude != null) supplier.setLatitude(latitude);
        if (longitude != null) supplier.setLongitude(longitude);

        Supplier saved = supplierRepository.save(supplier);

        adminAuditService.log(
                adminUserId,
                "UPDATE_SUPPLIER",
                "SUPPLIER",
                supplierId,
                "Updated supplier: " + supplier.getBusinessName(),
                null,
                null
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> toggleVerified(Long adminUserId, Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        boolean previousVerified = supplier.isVerified();
        supplier.setVerified(!previousVerified);

        Supplier saved = supplierRepository.save(supplier);

        adminAuditService.log(
                adminUserId,
                "TOGGLE_SUPPLIER_VERIFIED",
                "SUPPLIER",
                supplierId,
                "Toggled verification status for supplier: " + supplier.getBusinessName(),
                null,
                null
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> toggleDeactivated(Long adminUserId, Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        boolean previous = supplier.isDeactivated();
        supplier.setDeactivated(!previous);

        Supplier saved = supplierRepository.save(supplier);

        adminAuditService.log(
                adminUserId,
                "TOGGLE_SUPPLIER_DEACTIVATED",
                "SUPPLIER",
                supplierId,
                (saved.isDeactivated() ? "Deactivated" : "Reactivated") + " supplier: " + supplier.getBusinessName(),
                null,
                null
        );

        return toDto(saved);
    }

    private Map<String, Object> toDto(Supplier supplier) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", supplier.getId());
        dto.put("userId", supplier.getUser().getId());
        dto.put("userEmail", supplier.getUser().getEmail());
        dto.put("userName", supplier.getUser().getName());
        dto.put("businessName", supplier.getBusinessName());
        dto.put("category", supplier.getCategory() != null ? supplier.getCategory().name() : null);
        dto.put("county", supplier.getCounty());
        dto.put("town", supplier.getTown());
        dto.put("address", supplier.getAddress());
        dto.put("description", supplier.getDescription());
        dto.put("phone", supplier.getPhone());
        dto.put("website", supplier.getWebsite());
        dto.put("latitude", supplier.getLatitude());
        dto.put("longitude", supplier.getLongitude());
        dto.put("subscriptionStatus", supplier.getSubscriptionStatus() != null ? supplier.getSubscriptionStatus().name() : "NONE");
        dto.put("isVerified", supplier.isVerified());
        dto.put("isDeactivated", supplier.isDeactivated());
        dto.put("isFeatured", supplier.isFeatured());
        dto.put("rating", supplier.getRating());
        dto.put("reviewCount", supplier.getReviewCount());
        dto.put("offerCount", supplier.getOffers() != null ? supplier.getOffers().size() : 0);
        dto.put("createdAt", supplier.getCreatedAt() != null ? supplier.getCreatedAt().toString() : null);
        return dto;
    }
}
