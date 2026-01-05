package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.CreateExtraRequest;
import com.example.myislandapi.dto.request.UpdateExtraRequest;
import com.example.myislandapi.dto.response.ExtraResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.ExtrasService;
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
@RequestMapping("/api/owner/extras")
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Owner Extras", description = "Extras management for campsite owners")
@SecurityRequirement(name = "bearerAuth")
public class OwnerExtrasController {

    private final ExtrasService extrasService;

    public OwnerExtrasController(ExtrasService extrasService) {
        this.extrasService = extrasService;
    }

    @GetMapping
    @Operation(summary = "Get all extras for owner's campsites")
    public ResponseEntity<List<ExtraResponse>> getExtras(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) UUID campsiteId) {
        return ResponseEntity.ok(extrasService.getOwnerExtras(userDetails.getId(), campsiteId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific extra by ID")
    public ResponseEntity<ExtraResponse> getExtra(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(extrasService.getOwnerExtra(userDetails.getId(), id));
    }

    @PostMapping
    @Operation(summary = "Create a new extra for a campsite")
    public ResponseEntity<ExtraResponse> createExtra(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateExtraRequest request) {
        ExtraResponse created = extrasService.createExtra(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing extra")
    public ResponseEntity<ExtraResponse> updateExtra(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExtraRequest request) {
        return ResponseEntity.ok(extrasService.updateExtra(userDetails.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an extra (soft delete - sets available to false)")
    public ResponseEntity<Void> deleteExtra(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        extrasService.deleteExtra(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
