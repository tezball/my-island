package com.myisland.api.modules.marketplace.controller;

import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.myisland.api.modules.marketplace.dto.SubscriptionDto;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.modules.marketplace.service.SubscriptionService;
import com.myisland.api.security.CustomUserDetails;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/supplier/subscription")
@Tag(name = "Supplier Subscription", description = "Subscription management endpoints")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SupplierRepository supplierRepository;

    public SubscriptionController(SubscriptionService subscriptionService, SupplierRepository supplierRepository) {
        this.subscriptionService = subscriptionService;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    @Operation(summary = "Get subscription status")
    public ResponseEntity<SubscriptionDto> getSubscriptionStatus(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Supplier supplier = supplierRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return ResponseEntity.ok(subscriptionService.getSubscriptionStatus(supplier.getId()));
    }

    @PostMapping("/checkout")
    @Operation(summary = "Create Stripe checkout session")
    public ResponseEntity<CreateCheckoutSessionResponse> createCheckoutSession(
            @AuthenticationPrincipal CustomUserDetails userDetails) throws StripeException {

        Supplier supplier = supplierRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return ResponseEntity.ok(subscriptionService.createCheckoutSession(
                supplier.getId(),
                userDetails.getUsername() // Email is stored as username
        ));
    }

    @PostMapping("/portal")
    @Operation(summary = "Create Stripe customer portal session")
    public ResponseEntity<CreatePortalSessionResponse> createPortalSession(
            @AuthenticationPrincipal CustomUserDetails userDetails) throws StripeException {

        Supplier supplier = supplierRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return ResponseEntity.ok(subscriptionService.createPortalSession(supplier.getId()));
    }
}
