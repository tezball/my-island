package com.example.myislandapi.controller;

import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.OwnerStatsResponse;
import com.example.myislandapi.dto.response.RevenueDataResponse;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.BookingService;
import com.example.myislandapi.service.OwnerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    private final OwnerService ownerService;
    private final BookingService bookingService;

    public OwnerController(OwnerService ownerService, BookingService bookingService) {
        this.ownerService = ownerService;
        this.bookingService = bookingService;
    }

    @GetMapping("/stats")
    public ResponseEntity<OwnerStatsResponse> getStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) UUID campsiteId) {
        return ResponseEntity.ok(ownerService.getOwnerStats(userDetails.getId(), campsiteId));
    }

    @GetMapping("/campsites")
    public ResponseEntity<List<CampsiteResponse>> getCampsites(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ownerService.getOwnerCampsites(userDetails.getId()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<BookingResponse>> getBookings(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) UUID campsiteId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ownerService.getOwnerBookings(userDetails.getId(), status, campsiteId, pageable));
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

    @GetMapping("/revenue-data")
    public ResponseEntity<RevenueDataResponse> getRevenueData(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(ownerService.getRevenueData(userDetails.getId(), months));
    }
}
