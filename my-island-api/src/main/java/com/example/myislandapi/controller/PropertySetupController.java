package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.PropertyDraftRequest;
import com.example.myislandapi.dto.response.CampsiteDetailResponse;
import com.example.myislandapi.dto.response.PropertyDraftResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.PropertySetupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/owner/property")
@Tag(name = "Property Setup", description = "Property registration wizard endpoints")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('OWNER')")
public class PropertySetupController {

    private final PropertySetupService propertySetupService;

    public PropertySetupController(PropertySetupService propertySetupService) {
        this.propertySetupService = propertySetupService;
    }

    @GetMapping("/draft")
    @Operation(summary = "Get current draft", description = "Get the current property draft for the authenticated owner")
    public ResponseEntity<PropertyDraftResponse> getDraft(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return propertySetupService.getDraft(userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/draft")
    @Operation(summary = "Save draft", description = "Create or update property draft")
    public ResponseEntity<PropertyDraftResponse> saveDraft(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody PropertyDraftRequest request) {
        PropertyDraftResponse response = propertySetupService.saveDraft(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/draft")
    @Operation(summary = "Delete draft", description = "Delete the current property draft")
    public ResponseEntity<Void> deleteDraft(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        propertySetupService.deleteDraft(userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/draft/{draftId}/publish")
    @Operation(summary = "Publish property", description = "Publish draft as a live property")
    public ResponseEntity<CampsiteDetailResponse> publishDraft(
            @PathVariable UUID draftId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        CampsiteDetailResponse response = propertySetupService.publishDraft(draftId, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
