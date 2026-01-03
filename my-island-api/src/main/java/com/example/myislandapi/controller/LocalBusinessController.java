package com.example.myislandapi.controller;

import com.example.myislandapi.dto.response.LocalBusinessMapMarker;
import com.example.myislandapi.dto.response.LocalBusinessResponse;
import com.example.myislandapi.enums.SupplierCategory;
import com.example.myislandapi.service.LocalBusinessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/local-businesses")
@Tag(name = "Local Businesses", description = "Local business/supplier endpoints for map display")
public class LocalBusinessController {

    private final LocalBusinessService localBusinessService;

    public LocalBusinessController(LocalBusinessService localBusinessService) {
        this.localBusinessService = localBusinessService;
    }

    @GetMapping
    @Operation(summary = "Get all local businesses with optional filtering")
    public ResponseEntity<Page<LocalBusinessResponse>> getAll(
            @RequestParam(required = false) SupplierCategory category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(localBusinessService.getAll(category, search, pageable));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured local businesses")
    public ResponseEntity<Page<LocalBusinessResponse>> getFeatured(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(localBusinessService.getFeatured(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get local business by ID")
    public ResponseEntity<LocalBusinessResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(localBusinessService.getById(id));
    }

    @GetMapping("/map")
    @Operation(summary = "Get local business markers for map view within bounds")
    public ResponseEntity<List<LocalBusinessMapMarker>> getMapMarkers(
            @RequestParam double minLat,
            @RequestParam double maxLat,
            @RequestParam double minLng,
            @RequestParam double maxLng,
            @RequestParam(required = false) SupplierCategory category) {
        return ResponseEntity.ok(localBusinessService.getMapMarkers(minLat, maxLat, minLng, maxLng, category));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get local businesses near a location")
    public ResponseEntity<List<LocalBusinessResponse>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") double radius,
            @RequestParam(required = false) SupplierCategory category) {
        return ResponseEntity.ok(localBusinessService.getNearby(lat, lng, radius, category));
    }

    @GetMapping("/counties")
    @Operation(summary = "Get all counties with local businesses")
    public ResponseEntity<List<String>> getCounties() {
        return ResponseEntity.ok(localBusinessService.getCounties());
    }
}
