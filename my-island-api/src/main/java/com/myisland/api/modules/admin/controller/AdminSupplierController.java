package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.AdminSupplierService;
import com.myisland.api.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/suppliers")
public class AdminSupplierController {

    private final AdminSupplierService supplierService;

    public AdminSupplierController(AdminSupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<Page<Map<String, Object>>> listSuppliers(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(supplierService.listSuppliers(category, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSupplier(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplier(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSupplier(
            @RequestBody CreateSupplierRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.createSupplier(
                userDetails.getUserId(), request.userId(), request.businessName(), request.county(),
                request.town(), request.address(), request.category(), request.description(),
                request.phone(), request.website(), request.latitude(), request.longitude()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSupplier(
            @PathVariable Long id,
            @RequestBody UpdateSupplierRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.updateSupplier(
                userDetails.getUserId(), id, request.businessName(), request.county(),
                request.town(), request.address(), request.category(), request.description(),
                request.phone(), request.website(), request.latitude(), request.longitude()));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> toggleVerified(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.toggleVerified(userDetails.getUserId(), id));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> toggleDeactivated(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.toggleDeactivated(userDetails.getUserId(), id));
    }

    public record CreateSupplierRequest(
            Long userId,
            String businessName,
            String county,
            String town,
            String address,
            String category,
            String description,
            String phone,
            String website,
            Double latitude,
            Double longitude
    ) {}

    public record UpdateSupplierRequest(
            String businessName,
            String county,
            String town,
            String address,
            String category,
            String description,
            String phone,
            String website,
            Double latitude,
            Double longitude
    ) {}
}
