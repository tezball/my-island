package com.myisland.api.modules.accommodation.controller;

import com.myisland.api.modules.accommodation.dto.OwnerSubscriptionDto;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.accommodation.service.OwnerSubscriptionService;
import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.myisland.api.security.CustomUserDetails;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner/subscription")
@Tag(name = "Owner Subscription", description = "Owner subscription management endpoints")
public class OwnerSubscriptionController {

    private final OwnerSubscriptionService ownerSubscriptionService;
    private final OwnerRepository ownerRepository;

    public OwnerSubscriptionController(OwnerSubscriptionService ownerSubscriptionService, OwnerRepository ownerRepository) {
        this.ownerSubscriptionService = ownerSubscriptionService;
        this.ownerRepository = ownerRepository;
    }

    @GetMapping
    @Operation(summary = "Get owner subscription status")
    public ResponseEntity<OwnerSubscriptionDto> getSubscriptionStatus(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Owner owner = ownerRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return ResponseEntity.ok(ownerSubscriptionService.getSubscriptionStatus(owner.getId()));
    }

    @PostMapping("/checkout")
    @Operation(summary = "Create Stripe checkout session for owner")
    public ResponseEntity<CreateCheckoutSessionResponse> createCheckoutSession(
            @AuthenticationPrincipal CustomUserDetails userDetails) throws StripeException {

        Owner owner = ownerRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return ResponseEntity.ok(ownerSubscriptionService.createCheckoutSession(
                owner.getId(),
                userDetails.getUsername() // Email is stored as username
        ));
    }

    @PostMapping("/portal")
    @Operation(summary = "Create Stripe customer portal session for owner")
    public ResponseEntity<CreatePortalSessionResponse> createPortalSession(
            @AuthenticationPrincipal CustomUserDetails userDetails) throws StripeException {

        Owner owner = ownerRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return ResponseEntity.ok(ownerSubscriptionService.createPortalSession(owner.getId()));
    }
}
