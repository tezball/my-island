package com.example.myislandapi.controller;

import com.example.myislandapi.dto.response.CampsiteDetailResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LotResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.CampsiteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/campsites")
public class CampsiteController {

    private final CampsiteService campsiteService;

    public CampsiteController(CampsiteService campsiteService) {
        this.campsiteService = campsiteService;
    }

    @GetMapping
    public ResponseEntity<Page<CampsiteResponse>> getCampsites(
            @RequestParam(required = false) String county,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<CampsiteResponse> campsites;
        if (county != null || search != null) {
            campsites = campsiteService.searchCampsites(county, search, pageable);
        } else {
            campsites = campsiteService.getAllCampsites(pageable);
        }
        return ResponseEntity.ok(campsites);
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<CampsiteResponse>> getFeaturedCampsites(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(campsiteService.getFeaturedCampsites(pageable));
    }

    @GetMapping("/map")
    public ResponseEntity<List<CampsiteResponse>> getCampsitesForMap(
            @RequestParam double minLat,
            @RequestParam double maxLat,
            @RequestParam double minLng,
            @RequestParam double maxLng) {
        return ResponseEntity.ok(campsiteService.getCampsitesInBoundingBox(minLat, maxLat, minLng, maxLng));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampsiteDetailResponse> getCampsite(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UUID userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(campsiteService.getCampsiteById(id, userId));
    }

    @GetMapping("/{id}/lots")
    public ResponseEntity<List<LotResponse>> getCampsiteLots(@PathVariable UUID id) {
        return ResponseEntity.ok(campsiteService.getLotsByCampsiteId(id));
    }
}
