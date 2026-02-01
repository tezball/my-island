package com.myisland.api.modules.marketplace.controller;

import com.myisland.api.modules.marketplace.dto.ClaimOfferRequest;
import com.myisland.api.modules.marketplace.dto.OfferClaimDto;
import com.myisland.api.modules.marketplace.dto.OfferDto;
import com.myisland.api.modules.marketplace.dto.SupplierDto;
import com.myisland.api.modules.marketplace.service.MarketplaceService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marketplace")
@Tag(name = "Marketplace", description = "Public marketplace endpoints for browsing and claiming offers")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    @GetMapping("/suppliers")
    @Operation(summary = "Get all suppliers")
    public ResponseEntity<List<SupplierDto>> getAllSuppliers() {
        return ResponseEntity.ok(marketplaceService.getAllSuppliers());
    }

    @GetMapping("/suppliers/{id}")
    @Operation(summary = "Get supplier by ID")
    public ResponseEntity<SupplierDto> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(marketplaceService.getSupplierById(id));
    }

    @GetMapping("/suppliers/{id}/offers")
    @Operation(summary = "Get active offers for a supplier")
    public ResponseEntity<List<OfferDto>> getSupplierOffers(@PathVariable Long id) {
        return ResponseEntity.ok(marketplaceService.getSupplierOffers(id));
    }

    @GetMapping("/offers")
    @Operation(summary = "Get all available offers")
    public ResponseEntity<List<OfferDto>> getAvailableOffers() {
        return ResponseEntity.ok(marketplaceService.getAvailableOffers());
    }

    @GetMapping("/offers/{id}")
    @Operation(summary = "Get offer by ID")
    public ResponseEntity<OfferDto> getOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(marketplaceService.getOfferById(id));
    }

    @PostMapping("/offers/claim")
    @Operation(summary = "Claim an offer")
    public ResponseEntity<OfferClaimDto> claimOffer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ClaimOfferRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(marketplaceService.claimOffer(userDetails.getUserId(), request));
    }

    @GetMapping("/claims")
    @Operation(summary = "Get current user's claims")
    public ResponseEntity<List<OfferClaimDto>> getUserClaims(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(marketplaceService.getUserClaims(userDetails.getUserId()));
    }
}
