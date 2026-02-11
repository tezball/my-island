package com.myisland.api.modules.admin.service;

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
    private final AdminAuditService adminAuditService;

    public AdminSupplierService(SupplierRepository supplierRepository, AdminAuditService adminAuditService) {
        this.supplierRepository = supplierRepository;
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
    public Map<String, Object> updateSupplier(Long adminUserId, Long supplierId, String businessName, String county, String description) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        String previousValue = String.format("businessName=%s, county=%s, description=%s",
                supplier.getBusinessName(), supplier.getCounty(), supplier.getDescription());

        if (businessName != null) {
            supplier.setBusinessName(businessName);
        }
        if (county != null) {
            supplier.setCounty(county);
        }
        if (description != null) {
            supplier.setDescription(description);
        }

        Supplier saved = supplierRepository.save(supplier);

        String newValue = String.format("businessName=%s, county=%s, description=%s",
                saved.getBusinessName(), saved.getCounty(), saved.getDescription());

        adminAuditService.log(
                adminUserId,
                "UPDATE_SUPPLIER",
                "SUPPLIER",
                supplierId,
                "Updated supplier: " + supplier.getBusinessName(),
                previousValue,
                newValue
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
                "isVerified=" + previousVerified,
                "isVerified=" + saved.isVerified()
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
        dto.put("description", supplier.getDescription());
        dto.put("subscriptionStatus", supplier.getSubscriptionStatus() != null ? supplier.getSubscriptionStatus().name() : "NONE");
        dto.put("isVerified", supplier.isVerified());
        dto.put("rating", supplier.getRating());
        dto.put("reviewCount", supplier.getReviewCount());
        dto.put("offerCount", supplier.getOffers() != null ? supplier.getOffers().size() : 0);
        dto.put("createdAt", supplier.getCreatedAt() != null ? supplier.getCreatedAt().toString() : null);
        return dto;
    }
}
