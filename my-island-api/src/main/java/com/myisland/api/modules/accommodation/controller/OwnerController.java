package com.myisland.api.modules.accommodation.controller;

import com.myisland.api.modules.accommodation.dto.*;
import com.myisland.api.modules.accommodation.service.FeaturedPromotionService;
import com.myisland.api.modules.accommodation.service.OwnerService;
import com.myisland.api.modules.accommodation.service.OwnerSubscriptionService;
import com.myisland.api.modules.booking.dto.BookingDto;
import com.myisland.api.modules.booking.dto.CreateManualBookingRequest;
import com.myisland.api.modules.booking.dto.ModificationRequestDto;
import com.myisland.api.modules.booking.dto.ModifyBookingRequest;
import com.myisland.api.modules.booking.dto.ResolveModificationRequest;
import com.myisland.api.modules.booking.service.BookingService;
import com.myisland.api.modules.marketplace.dto.ConfirmSubscriptionRequest;
import com.myisland.api.modules.marketplace.dto.ConnectStatusDto;
import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.myisland.api.modules.marketplace.dto.OnboardingLinkResponse;
import com.myisland.api.modules.marketplace.dto.PurchaseFeaturedRequest;
import com.myisland.api.modules.marketplace.dto.SetupIntentResponse;
import com.myisland.api.modules.marketplace.service.StripeConnectService;
import com.myisland.api.modules.review.dto.OwnerReviewResponseRequest;
import com.myisland.api.modules.review.dto.ReviewDto;
import com.myisland.api.modules.review.service.ReviewService;
import com.myisland.api.security.CustomUserDetails;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/owner")
@Tag(name = "Owner", description = "Property owner management endpoints")
public class OwnerController {

    private final OwnerService ownerService;
    private final OwnerSubscriptionService ownerSubscriptionService;
    private final FeaturedPromotionService featuredPromotionService;
    private final StripeConnectService stripeConnectService;
    private final BookingService bookingService;
    private final ReviewService reviewService;

    public OwnerController(OwnerService ownerService, OwnerSubscriptionService ownerSubscriptionService,
                           FeaturedPromotionService featuredPromotionService, StripeConnectService stripeConnectService,
                           BookingService bookingService, ReviewService reviewService) {
        this.ownerService = ownerService;
        this.ownerSubscriptionService = ownerSubscriptionService;
        this.featuredPromotionService = featuredPromotionService;
        this.stripeConnectService = stripeConnectService;
        this.bookingService = bookingService;
        this.reviewService = reviewService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get owner profile")
    public ResponseEntity<OwnerDto> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOwnerProfile(userDetails.getUserId()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update owner profile")
    public ResponseEntity<OwnerDto> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateOwnerRequest request
    ) {
        return ResponseEntity.ok(ownerService.updateOwnerProfile(userDetails.getUserId(), request));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get owner dashboard data")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOwnerDashboard(userDetails.getUserId()));
    }

    @GetMapping("/lots")
    @Operation(summary = "Get all lots for current owner")
    public ResponseEntity<List<LotDto>> getLots(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOwnerLots(userDetails.getUserId()));
    }

    @PostMapping("/lots")
    @Operation(summary = "Create a new lot")
    public ResponseEntity<LotDto> createLot(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateLotRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ownerService.createLot(userDetails.getUserId(), request));
    }

    @PutMapping("/lots/{lotId}")
    @Operation(summary = "Update a lot")
    public ResponseEntity<LotDto> updateLot(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long lotId,
            @Valid @RequestBody UpdateLotRequest request
    ) {
        return ResponseEntity.ok(ownerService.updateLot(userDetails.getUserId(), lotId, request));
    }

    @DeleteMapping("/lots/{lotId}")
    @Operation(summary = "Delete a lot")
    public ResponseEntity<Void> deleteLot(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long lotId
    ) {
        ownerService.deleteLot(userDetails.getUserId(), lotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lots/export")
    @Operation(summary = "Export all lots as JSON")
    public ResponseEntity<Map<String, Object>> exportLots(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Map<String, Object> export = ownerService.exportLots(userDetails.getUserId());
        String filename = "lots-export-" + LocalDate.now() + ".json";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(export);
    }

    @PostMapping("/lots/import")
    @Operation(summary = "Import lots from JSON")
    public ResponseEntity<ImportLotsResponse> importLots(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ImportLotsRequest request
    ) {
        return ResponseEntity.ok(ownerService.importLots(userDetails.getUserId(), request));
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get owner preferences")
    public ResponseEntity<OwnerPreferencesDto> getPreferences(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOwnerPreferences(userDetails.getUserId()));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update owner preferences")
    public ResponseEntity<OwnerPreferencesDto> updatePreferences(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody OwnerPreferencesDto preferences
    ) {
        return ResponseEntity.ok(ownerService.updateOwnerPreferences(userDetails.getUserId(), preferences));
    }

    @GetMapping("/bookings/today")
    @Operation(summary = "Get today's arrivals and departures")
    public ResponseEntity<Map<String, List<BookingDto>>> getTodayMovements(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getTodayMovements(userDetails.getUserId()));
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings for owner's lots")
    public ResponseEntity<List<BookingDto>> getBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOwnerBookings(userDetails.getUserId()));
    }

    @PostMapping("/bookings")
    @Operation(summary = "Create a manual booking")
    public ResponseEntity<BookingDto> createManualBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateManualBookingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createManualBooking(userDetails.getUserId(), request));
    }

    @GetMapping("/pricing-rules")
    @Operation(summary = "Get all seasonal pricing rules")
    public ResponseEntity<List<SeasonalPricingRuleDto>> getPricingRules(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getPricingRules(userDetails.getUserId()));
    }

    @PostMapping("/pricing-rules")
    @Operation(summary = "Create a seasonal pricing rule")
    public ResponseEntity<SeasonalPricingRuleDto> createPricingRule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateSeasonalPricingRuleRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ownerService.createPricingRule(userDetails.getUserId(), request));
    }

    @DeleteMapping("/pricing-rules/{id}")
    @Operation(summary = "Delete a seasonal pricing rule")
    public ResponseEntity<Void> deletePricingRule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        ownerService.deletePricingRule(userDetails.getUserId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/blocked-periods")
    @Operation(summary = "Get all blocked periods for owner's lots")
    public ResponseEntity<List<BlockedPeriodDto>> getBlockedPeriods(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getBlockedPeriods(userDetails.getUserId()));
    }

    @PostMapping("/blocked-periods")
    @Operation(summary = "Create a blocked period")
    public ResponseEntity<BlockedPeriodDto> createBlockedPeriod(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateBlockedPeriodRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ownerService.createBlockedPeriod(userDetails.getUserId(), request));
    }

    @DeleteMapping("/blocked-periods/{id}")
    @Operation(summary = "Delete a blocked period")
    public ResponseEntity<Void> deleteBlockedPeriod(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        ownerService.deleteBlockedPeriod(userDetails.getUserId(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/bookings/{bookingId}/confirm")
    @Operation(summary = "Confirm a booking (captures payment)")
    public ResponseEntity<BookingDto> confirmBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(bookingService.confirmBooking(bookingId, userDetails.getUserId()));
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    @Operation(summary = "Cancel/reject a booking")
    public ResponseEntity<BookingDto> cancelBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, userDetails.getUserId()));
    }

    @PutMapping("/bookings/{bookingId}/check-in")
    @Operation(summary = "Check in a booking")
    public ResponseEntity<BookingDto> checkInBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(bookingService.checkInBooking(bookingId, userDetails.getUserId()));
    }

    @PutMapping("/bookings/{bookingId}/check-out")
    @Operation(summary = "Check out a booking")
    public ResponseEntity<BookingDto> checkOutBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(bookingService.checkOutBooking(bookingId, userDetails.getUserId()));
    }

    @PutMapping("/bookings/{bookingId}/modify")
    @Operation(summary = "Modify booking dates or lot assignment")
    public ResponseEntity<BookingDto> modifyBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId,
            @RequestBody ModifyBookingRequest request
    ) {
        return ResponseEntity.ok(bookingService.modifyBooking(bookingId, userDetails.getUserId(), request));
    }

    // ==================== Modification Request Endpoints ====================

    @GetMapping("/modification-requests")
    @Operation(summary = "Get pending modification requests for owner's bookings")
    public ResponseEntity<List<ModificationRequestDto>> getPendingModificationRequests(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(bookingService.getOwnerPendingModificationRequests(userDetails.getUserId()));
    }

    @PostMapping("/modification-requests/{requestId}/resolve")
    @Operation(summary = "Approve or decline a guest modification request")
    public ResponseEntity<ModificationRequestDto> resolveModificationRequest(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long requestId,
            @RequestBody ResolveModificationRequest request
    ) {
        return ResponseEntity.ok(bookingService.resolveModificationRequest(
                requestId, userDetails.getUserId(), request.approve(), request.declineReason()));
    }

    @GetMapping("/analytics/lots")
    @Operation(summary = "Get detailed lots analytics")
    public ResponseEntity<LotsDetailResponse> getLotsAnalytics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getLotsAnalytics(userDetails.getUserId()));
    }

    @GetMapping("/analytics/bookings")
    @Operation(summary = "Get detailed bookings analytics")
    public ResponseEntity<BookingsDetailResponse> getBookingsAnalytics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getBookingsAnalytics(userDetails.getUserId()));
    }

    @GetMapping("/analytics/revenue")
    @Operation(summary = "Get detailed revenue analytics")
    public ResponseEntity<RevenueDetailResponse> getRevenueAnalytics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getRevenueAnalytics(userDetails.getUserId()));
    }

    @GetMapping("/analytics/occupancy")
    @Operation(summary = "Get detailed occupancy analytics")
    public ResponseEntity<OccupancyDetailResponse> getOccupancyAnalytics(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOccupancyAnalytics(userDetails.getUserId()));
    }

    @PostMapping("/featured/purchase")
    @Operation(summary = "Purchase featured promotion")
    public ResponseEntity<Map<String, String>> purchaseFeatured(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody PurchaseFeaturedRequest request
    ) throws StripeException {
        String checkoutUrl = featuredPromotionService.createFeaturedCheckout(
                userDetails.getUserId(),
                request.duration()
        );
        return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
    }

    // Subscription endpoints
    @GetMapping("/subscription")
    @Operation(summary = "Get owner subscription status")
    public ResponseEntity<OwnerSubscriptionDto> getSubscription(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(ownerSubscriptionService.getSubscriptionStatus(owner.id()));
    }

    @PostMapping("/subscription/setup-intent")
    @Operation(summary = "Create setup intent for card collection")
    public ResponseEntity<SetupIntentResponse> createSetupIntent(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws StripeException {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(ownerSubscriptionService.createSetupIntent(owner.id(), userDetails.getUsername()));
    }

    @PostMapping("/subscription/confirm")
    @Operation(summary = "Confirm subscription with payment method")
    public ResponseEntity<OwnerSubscriptionDto> confirmSubscription(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ConfirmSubscriptionRequest request
    ) throws StripeException {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(ownerSubscriptionService.confirmSubscription(owner.id(), request));
    }

    @PostMapping("/subscription/checkout")
    @Operation(summary = "Create checkout session (legacy redirect flow)")
    public ResponseEntity<CreateCheckoutSessionResponse> createCheckoutSession(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws StripeException {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(ownerSubscriptionService.createCheckoutSession(owner.id(), userDetails.getUsername()));
    }

    @PostMapping("/subscription/portal")
    @Operation(summary = "Create billing portal session")
    public ResponseEntity<CreatePortalSessionResponse> createPortalSession(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws StripeException {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(ownerSubscriptionService.createPortalSession(owner.id()));
    }

    // Stripe Connect endpoints
    @GetMapping("/connect/status")
    @Operation(summary = "Get Connect account status")
    public ResponseEntity<ConnectStatusDto> getConnectStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws StripeException {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(stripeConnectService.getOwnerConnectStatus(owner.id()));
    }

    @PostMapping("/connect/onboard")
    @Operation(summary = "Start Connect onboarding")
    public ResponseEntity<OnboardingLinkResponse> startConnectOnboarding(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String returnUrl,
            @RequestParam String refreshUrl
    ) throws StripeException {
        OwnerDto owner = ownerService.getOwnerProfile(userDetails.getUserId());
        return ResponseEntity.ok(stripeConnectService.createOwnerOnboardingLink(owner.id(), returnUrl, refreshUrl));
    }

    // Review endpoints
    @GetMapping("/reviews")
    @Operation(summary = "Get all reviews for owner's campsite")
    public ResponseEntity<List<ReviewDto>> getReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(reviewService.getOwnerReviews(userDetails.getUserId()));
    }

    @PutMapping("/reviews/{reviewId}/respond")
    @Operation(summary = "Respond to a review")
    public ResponseEntity<ReviewDto> respondToReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long reviewId,
            @Valid @RequestBody OwnerReviewResponseRequest request
    ) {
        return ResponseEntity.ok(reviewService.respondToReview(userDetails.getUserId(), reviewId, request));
    }
}
