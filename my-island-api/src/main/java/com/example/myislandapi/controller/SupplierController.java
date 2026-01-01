package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.UpdateSupplierProfileRequest;
import com.example.myislandapi.dto.response.SupplierProfileResponse;
import com.example.myislandapi.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/supplier")
@Tag(name = "Supplier", description = "Supplier business profile endpoints")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('SUPPLIER')")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get supplier business profile")
    public ResponseEntity<SupplierProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(supplierService.getProfile(userId));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update supplier business profile")
    public ResponseEntity<SupplierProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateSupplierProfileRequest request) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(supplierService.updateProfile(userId, request));
    }

    @PostMapping("/logo")
    @Operation(summary = "Update supplier logo URL (after image upload)")
    public ResponseEntity<Map<String, String>> updateLogoUrl(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String logoUrl) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        supplierService.updateLogoUrl(userId, logoUrl);
        return ResponseEntity.ok(Map.of("logoUrl", logoUrl));
    }
}
