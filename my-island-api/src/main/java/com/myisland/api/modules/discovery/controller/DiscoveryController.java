package com.myisland.api.modules.discovery.controller;

import com.myisland.api.modules.discovery.dto.PoiDto;
import com.myisland.api.modules.discovery.dto.UpdateVisitRequest;
import com.myisland.api.modules.discovery.dto.UserPoiVisitDto;
import com.myisland.api.modules.discovery.entity.PointOfInterest.PoiCategory;
import com.myisland.api.modules.discovery.entity.UserPoiVisit.VisitStatus;
import com.myisland.api.modules.discovery.service.DiscoveryService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/discovery")
@Tag(name = "Discovery", description = "Points of interest and travel journal")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping("/pois")
    @Operation(summary = "Get all points of interest")
    public ResponseEntity<List<PoiDto>> getAllPois() {
        return ResponseEntity.ok(discoveryService.getAllPois());
    }

    @GetMapping("/pois/{id}")
    @Operation(summary = "Get a point of interest by ID")
    public ResponseEntity<PoiDto> getPoiById(@PathVariable Long id) {
        return ResponseEntity.ok(discoveryService.getPoiById(id));
    }

    @GetMapping("/pois/category/{category}")
    @Operation(summary = "Get points of interest by category")
    public ResponseEntity<List<PoiDto>> getPoisByCategory(@PathVariable PoiCategory category) {
        return ResponseEntity.ok(discoveryService.getPoisByCategory(category));
    }

    @GetMapping("/visits")
    @Operation(summary = "Get current user's POI visits")
    public ResponseEntity<List<UserPoiVisitDto>> getUserVisits(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(discoveryService.getUserVisits(userDetails.getUserId()));
    }

    @GetMapping("/visits/stats")
    @Operation(summary = "Get current user's visit statistics")
    public ResponseEntity<Map<String, Long>> getUserVisitStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(discoveryService.getUserVisitStats(userDetails.getUserId()));
    }

    @PostMapping("/visits")
    @Operation(summary = "Create or update a POI visit")
    public ResponseEntity<UserPoiVisitDto> upsertVisit(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateVisitRequest request) {
        VisitStatus status = VisitStatus.valueOf(request.status());
        UserPoiVisitDto visit = discoveryService.upsertVisit(
                userDetails.getUserId(), request.poiId(), status, request.notes());
        return ResponseEntity.ok(visit);
    }

    @DeleteMapping("/visits/{poiId}")
    @Operation(summary = "Remove a POI visit (mark as unvisited)")
    public ResponseEntity<Void> deleteVisit(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long poiId) {
        discoveryService.deleteVisit(userDetails.getUserId(), poiId);
        return ResponseEntity.noContent().build();
    }
}
