package com.myisland.api.controller;

import com.myisland.api.dto.request.CreateBookingRequest;
import com.myisland.api.dto.request.UpdateBookingRequest;
import com.myisland.api.dto.response.BookingResponse;
import com.myisland.api.entity.User;
import com.myisland.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<Map<String, List<BookingResponse>>> listBookings(
        @AuthenticationPrincipal User user,
        @RequestParam(required = false) String status
    ) {
        List<BookingResponse> bookings = bookingService.getUserBookings(user.getId(), status);
        return ResponseEntity.ok(Map.of("bookings", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, BookingResponse>> getBooking(@PathVariable UUID id) {
        BookingResponse booking = bookingService.getBooking(id);
        return ResponseEntity.ok(Map.of("booking", booking));
    }

    @PostMapping
    public ResponseEntity<Map<String, BookingResponse>> createBooking(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody CreateBookingRequest request
    ) {
        BookingResponse booking = bookingService.createBooking(user, request);
        return ResponseEntity.ok(Map.of("booking", booking));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, BookingResponse>> updateBooking(
        @PathVariable UUID id,
        @RequestBody UpdateBookingRequest request
    ) {
        BookingResponse booking = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(Map.of("booking", booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
