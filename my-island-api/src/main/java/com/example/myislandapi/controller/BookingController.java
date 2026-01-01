package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.CreateBookingRequest;
import com.example.myislandapi.dto.response.AvailabilityResponse;
import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.AvailabilityService;
import com.example.myislandapi.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;
    private final AvailabilityService availabilityService;

    public BookingController(BookingService bookingService, AvailabilityService availabilityService) {
        this.bookingService = bookingService;
        this.availabilityService = availabilityService;
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse booking = bookingService.createBooking(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) BookingStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getId(), status, pageable));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingResponse> getBooking(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBooking(id, userDetails.getId()));
    }

    @PostMapping("/bookings/{id}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id, userDetails.getId()));
    }

    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userDetails.getId(), reason));
    }

    @GetMapping("/lots/{lotId}/availability")
    public ResponseEntity<AvailabilityResponse> getLotAvailability(
            @PathVariable UUID lotId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(availabilityService.getAvailability(lotId, startDate, endDate));
    }
}
