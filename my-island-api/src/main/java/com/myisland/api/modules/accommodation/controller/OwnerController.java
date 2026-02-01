package com.myisland.api.modules.accommodation.controller;

import com.myisland.api.modules.accommodation.dto.*;
import com.myisland.api.modules.accommodation.service.OwnerService;
import com.myisland.api.modules.booking.dto.BookingDto;
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
@RequestMapping("/owner")
@Tag(name = "Owner", description = "Property owner management endpoints")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
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

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings for owner's lots")
    public ResponseEntity<List<BookingDto>> getBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getOwnerBookings(userDetails.getUserId()));
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
}
