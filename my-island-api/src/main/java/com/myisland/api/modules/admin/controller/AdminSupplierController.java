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

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSupplier(
            @PathVariable Long id,
            @RequestBody UpdateSupplierRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.updateSupplier(
                userDetails.getUserId(), id, request.businessName(), request.county(), request.description()));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> toggleVerified(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(supplierService.toggleVerified(userDetails.getUserId(), id));
    }

    public record UpdateSupplierRequest(
            String businessName,
            String county,
            String description
    ) {}
}
