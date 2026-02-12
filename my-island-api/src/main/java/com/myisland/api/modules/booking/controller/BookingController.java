package com.myisland.api.modules.booking.controller;

import com.myisland.api.modules.booking.dto.*;
import com.myisland.api.modules.booking.service.BookingPaymentService;
import com.myisland.api.modules.booking.service.BookingService;
import com.myisland.api.security.CustomUserDetails;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "Booking management endpoints")
public class BookingController {

    private final BookingService bookingService;
    private final BookingPaymentService bookingPaymentService;

    public BookingController(BookingService bookingService, BookingPaymentService bookingPaymentService) {
        this.bookingService = bookingService;
        this.bookingPaymentService = bookingPaymentService;
    }

    @GetMapping
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<List<BookingDto>> getUserBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getUserId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingDto> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getBookingById(id, userDetails.getUserId()));
    }

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingDto> createBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(userDetails.getUserId(), request));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<BookingDto> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userDetails.getUserId()));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm a booking (Owner only)")
    public ResponseEntity<BookingDto> confirmBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.confirmBooking(id, userDetails.getUserId()));
    }

    @PostMapping("/{id}/payment/intent")
    @Operation(summary = "Create a payment intent for a booking")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws StripeException {
        return ResponseEntity.ok(bookingPaymentService.createPaymentIntent(id, userDetails.getUserId()));
    }

    @GetMapping("/{id}/payment/status")
    @Operation(summary = "Get payment status for a booking")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        BookingDto booking = bookingService.getBookingById(id, userDetails.getUserId());
        return ResponseEntity.ok(new PaymentStatusResponse(
                booking.status(),
                booking.paymentStatus(),
                booking.chargeTotal()
        ));
    }

    @PostMapping("/{id}/retry-payment")
    @Operation(summary = "Reset a failed payment booking back to pending_payment for retry")
    public ResponseEntity<BookingDto> retryPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.retryPayment(id, userDetails.getUserId()));
    }

    @PostMapping("/{id}/payment/confirm-authorization")
    @Operation(summary = "Confirm payment authorization after card submission (syncs status from Stripe)")
    public ResponseEntity<BookingDto> confirmAuthorization(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws StripeException {
        return ResponseEntity.ok(bookingPaymentService.confirmAuthorization(id, userDetails.getUserId()));
    }

    @PostMapping("/{id}/payment/simulate-success")
    @Operation(summary = "Simulate payment success (dev mode only)")
    public ResponseEntity<BookingDto> simulatePaymentSuccess(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.simulatePaymentSuccess(id, userDetails.getUserId()));
    }

    // ==================== Guest Modification Endpoints ====================

    @GetMapping("/{id}/modification-policy")
    @Operation(summary = "Get guest modification policy for a booking")
    public ResponseEntity<GuestModificationPolicyDto> getModificationPolicy(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getModificationPolicy(id, userDetails.getUserId()));
    }

    @PutMapping("/{id}/modify")
    @Operation(summary = "Guest modifies their booking (auto-approve or creates request)")
    public ResponseEntity<BookingDto> guestModifyBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody GuestModifyBookingRequest request) {
        return ResponseEntity.ok(bookingService.guestModifyBooking(id, userDetails.getUserId(), request));
    }

    @GetMapping("/{id}/modification-requests")
    @Operation(summary = "Get modification requests for a booking (guest)")
    public ResponseEntity<List<ModificationRequestDto>> getModificationRequests(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getBookingModificationRequests(id, userDetails.getUserId()));
    }

    @PostMapping("/{id}/modification-requests/{requestId}/cancel")
    @Operation(summary = "Guest cancels a pending modification request")
    public ResponseEntity<Void> cancelModificationRequest(
            @PathVariable Long id,
            @PathVariable Long requestId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        bookingService.cancelModificationRequest(id, requestId, userDetails.getUserId());
        return ResponseEntity.noContent().build();
    }

    public record PaymentStatusResponse(
            String bookingStatus,
            String paymentStatus,
            java.math.BigDecimal chargeTotal
    ) {}
}
