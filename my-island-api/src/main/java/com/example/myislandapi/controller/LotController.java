package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.AutoAssignLotRequest;
import com.example.myislandapi.dto.request.CreateLotRequest;
import com.example.myislandapi.dto.request.UpdateLotRequest;
import com.example.myislandapi.dto.response.AutoAssignLotResponse;
import com.example.myislandapi.dto.response.LotResponse;
import com.example.myislandapi.dto.response.LotTypeAggregationResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.LotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lots")
@Tag(name = "Lots", description = "Lot management endpoints")
public class LotController {

    private final LotService lotService;

    public LotController(LotService lotService) {
        this.lotService = lotService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lot by ID")
    public ResponseEntity<LotResponse> getLot(@PathVariable UUID id) {
        return ResponseEntity.ok(lotService.getLotById(id));
    }

    @GetMapping
    @Operation(summary = "Get lots by campsite ID")
    public ResponseEntity<List<LotResponse>> getLotsByCampsite(@RequestParam UUID campsiteId) {
        return ResponseEntity.ok(lotService.getLotsByCampsiteId(campsiteId));
    }

    @GetMapping("/types")
    @Operation(summary = "Get lot types aggregated by campsite ID")
    public ResponseEntity<List<LotTypeAggregationResponse>> getLotTypes(@RequestParam UUID campsiteId) {
        return ResponseEntity.ok(lotService.getLotTypesByCampsiteId(campsiteId));
    }

    @PostMapping("/auto-assign")
    @Operation(summary = "Auto-assign the best available lot of the specified type")
    public ResponseEntity<AutoAssignLotResponse> autoAssignLot(
            @Valid @RequestBody AutoAssignLotRequest request) {
        return ResponseEntity.ok(lotService.autoAssignLot(request));
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Create a new lot")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<LotResponse> createLot(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateLotRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lotService.createLot(userDetails.getId(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Update a lot")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<LotResponse> updateLot(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLotRequest request) {
        return ResponseEntity.ok(lotService.updateLot(id, userDetails.getId(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Delete a lot")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteLot(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        lotService.deleteLot(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
