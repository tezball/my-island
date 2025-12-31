package com.myisland.controller;

import com.myisland.dto.CreateBookingRequest;
import com.myisland.dto.ErrorResponse;
import com.myisland.dto.UpdateBookingRequest;
import com.myisland.model.Booking;
import com.myisland.model.User;
import com.myisland.service.AuthService;
import com.myisland.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final AuthService authService;

    public BookingController(BookingService bookingService, AuthService authService) {
        this.bookingService = bookingService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) String status
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        List<Booking> bookings = bookingService.getBookingsForUser(userOpt.get().getId(), status);
        return ResponseEntity.ok(Map.of("bookings", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(Map.of("booking", booking.get()));
        }
        return ResponseEntity.status(404).body(new ErrorResponse("Booking not found"));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody CreateBookingRequest request
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        Optional<Booking> booking = bookingService.createBooking(request, userOpt.get().getId());
        if (booking.isPresent()) {
            return ResponseEntity.status(201).body(Map.of("booking", booking.get()));
        }
        return ResponseEntity.status(400).body(new ErrorResponse("Invalid booking request"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id,
            @RequestBody UpdateBookingRequest request
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        Optional<Booking> booking = bookingService.updateBooking(id, request);
        if (booking.isPresent()) {
            return ResponseEntity.ok(Map.of("booking", booking.get()));
        }
        return ResponseEntity.status(404).body(new ErrorResponse("Booking not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        if (bookingService.cancelBooking(id)) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(404).body(new ErrorResponse("Booking not found"));
    }
}
