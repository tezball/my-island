package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.AdminOwnerService;
import com.myisland.api.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/admin/owners")
public class AdminOwnerController {

    private final AdminOwnerService ownerService;

    public AdminOwnerController(AdminOwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping
    public ResponseEntity<Page<Map<String, Object>>> listOwners(
            @RequestParam(required = false) String subscriptionStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ownerService.listOwners(subscriptionStatus, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOwner(@PathVariable Long id) {
        return ResponseEntity.ok(ownerService.getOwner(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOwner(
            @RequestBody CreateOwnerRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ownerService.createOwner(
                userDetails.getUserId(), request.userId(), request.propertyName(), request.county(),
                request.town(), request.propertyType(), request.description(), request.phone(),
                request.website(), request.latitude(), request.longitude()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateOwner(
            @PathVariable Long id,
            @RequestBody UpdateOwnerRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ownerService.updateOwner(
                userDetails.getUserId(), id, request.propertyName(), request.county(),
                request.town(), request.propertyType(), request.description(), request.phone(),
                request.website(), request.latitude(), request.longitude()));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> toggleDeactivated(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ownerService.toggleDeactivated(userDetails.getUserId(), id));
    }

    public record CreateOwnerRequest(
            Long userId,
            String propertyName,
            String county,
            String town,
            String propertyType,
            String description,
            String phone,
            String website,
            BigDecimal latitude,
            BigDecimal longitude
    ) {}

    public record UpdateOwnerRequest(
            String propertyName,
            String county,
            String town,
            String propertyType,
            String description,
            String phone,
            String website,
            BigDecimal latitude,
            BigDecimal longitude
    ) {}
}
