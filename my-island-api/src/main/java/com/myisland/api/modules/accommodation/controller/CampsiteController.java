package com.myisland.api.modules.accommodation.controller;

import com.myisland.api.modules.accommodation.dto.LotDto;
import com.myisland.api.modules.accommodation.dto.OwnerDto;
import com.myisland.api.modules.accommodation.service.CampsiteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/campsites")
@Tag(name = "Campsites", description = "Public campsite browsing endpoints")
public class CampsiteController {

    private final CampsiteService campsiteService;

    public CampsiteController(CampsiteService campsiteService) {
        this.campsiteService = campsiteService;
    }

    @GetMapping
    @Operation(summary = "Get all campsites")
    public ResponseEntity<List<OwnerDto>> getAllCampsites() {
        return ResponseEntity.ok(campsiteService.getAllCampsites());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get campsite by ID")
    public ResponseEntity<OwnerDto> getCampsiteById(@PathVariable Long id) {
        return ResponseEntity.ok(campsiteService.getCampsiteById(id));
    }

    @GetMapping("/counties")
    @Operation(summary = "Get all counties with campsites")
    public ResponseEntity<List<String>> getCounties() {
        return ResponseEntity.ok(campsiteService.getAllCounties());
    }

    @GetMapping("/county/{county}")
    @Operation(summary = "Get campsites by county")
    public ResponseEntity<List<OwnerDto>> getCampsitesByCounty(@PathVariable String county) {
        return ResponseEntity.ok(campsiteService.getCampsitesByCounty(county));
    }

    @GetMapping("/{id}/lots")
    @Operation(summary = "Get all lots for a campsite")
    public ResponseEntity<List<LotDto>> getCampsiteLots(@PathVariable Long id) {
        return ResponseEntity.ok(campsiteService.getCampsiteLots(id));
    }

    @GetMapping("/{id}/lots/available")
    @Operation(summary = "Get available lots for a campsite within date range")
    public ResponseEntity<List<LotDto>> getAvailableLots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        return ResponseEntity.ok(campsiteService.getAvailableLots(id, checkIn, checkOut));
    }

    @GetMapping("/lots/{lotId}")
    @Operation(summary = "Get lot details by ID")
    public ResponseEntity<LotDto> getLotById(@PathVariable Long lotId) {
        return ResponseEntity.ok(campsiteService.getLotById(lotId));
    }
}
