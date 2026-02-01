package com.myisland.api.modules.marketplace.controller;

import com.myisland.api.modules.marketplace.dto.*;
import com.myisland.api.modules.marketplace.service.MarketplaceService;
import com.myisland.api.modules.marketplace.service.SupplierService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/supplier")
@Tag(name = "Supplier", description = "Supplier management endpoints")
public class SupplierController {

    private final SupplierService supplierService;
    private final MarketplaceService marketplaceService;

    public SupplierController(SupplierService supplierService, MarketplaceService marketplaceService) {
        this.supplierService = supplierService;
        this.marketplaceService = marketplaceService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get supplier profile")
    public ResponseEntity<SupplierDto> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(supplierService.getSupplierProfile(userDetails.getUserId()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update supplier profile")
    public ResponseEntity<SupplierDto> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateSupplierRequest request
    ) {
        return ResponseEntity.ok(supplierService.updateSupplierProfile(userDetails.getUserId(), request));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get supplier dashboard data")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(supplierService.getSupplierDashboard(userDetails.getUserId()));
    }

    @GetMapping("/offers")
    @Operation(summary = "Get all offers for current supplier")
    public ResponseEntity<List<OfferDto>> getOffers(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(supplierService.getSupplierOffers(userDetails.getUserId()));
    }

    @PostMapping("/offers")
    @Operation(summary = "Create a new offer")
    public ResponseEntity<OfferDto> createOffer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateOfferRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supplierService.createOffer(userDetails.getUserId(), request));
    }

    @PutMapping("/offers/{offerId}")
    @Operation(summary = "Update an offer")
    public ResponseEntity<OfferDto> updateOffer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long offerId,
            @Valid @RequestBody UpdateOfferRequest request
    ) {
        return ResponseEntity.ok(supplierService.updateOffer(userDetails.getUserId(), offerId, request));
    }

    @DeleteMapping("/offers/{offerId}")
    @Operation(summary = "Delete an offer")
    public ResponseEntity<Void> deleteOffer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long offerId
    ) {
        supplierService.deleteOffer(userDetails.getUserId(), offerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offers/{offerId}/claims")
    @Operation(summary = "Get all claims for an offer")
    public ResponseEntity<List<OfferClaimDto>> getOfferClaims(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long offerId
    ) {
        return ResponseEntity.ok(supplierService.getOfferClaims(userDetails.getUserId(), offerId));
    }

    @GetMapping("/claims")
    @Operation(summary = "Get all claims for current supplier")
    public ResponseEntity<List<OfferClaimDto>> getAllClaims(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(supplierService.getAllSupplierClaims(userDetails.getUserId()));
    }

    @GetMapping("/claims/test")
    @Operation(summary = "Get all test claims for current supplier")
    public ResponseEntity<List<OfferClaimDto>> getTestClaims(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(supplierService.getTestClaims(userDetails.getUserId()));
    }

    @PostMapping("/offers/{offerId}/test-claim")
    @Operation(summary = "Create a test claim for an offer")
    public ResponseEntity<OfferClaimDto> createTestClaim(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long offerId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(marketplaceService.createTestClaim(userDetails.getUserId(), offerId));
    }

    @DeleteMapping("/claims/test/{claimCode}")
    @Operation(summary = "Reset (delete) a test claim")
    public ResponseEntity<Void> resetTestClaim(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String claimCode
    ) {
        marketplaceService.resetTestClaim(userDetails.getUserId(), claimCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/redeem/validate/{claimCode}")
    @Operation(summary = "Validate a claim code without redeeming")
    public ResponseEntity<OfferClaimDto> validateClaim(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String claimCode
    ) {
        return ResponseEntity.ok(marketplaceService.validateClaim(userDetails.getUserId(), claimCode));
    }

    @PostMapping("/redeem/{claimCode}")
    @Operation(summary = "Redeem a claim code")
    public ResponseEntity<OfferClaimDto> redeemClaim(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String claimCode
    ) {
        return ResponseEntity.ok(marketplaceService.redeemClaim(userDetails.getUserId(), claimCode));
    }
}
