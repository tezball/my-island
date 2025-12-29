package com.myisland.api.controller;

import com.myisland.api.dto.response.CampsiteResponse;
import com.myisland.api.service.CampsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/campsites")
@RequiredArgsConstructor
public class CampsiteController {

    private final CampsiteService campsiteService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listCampsites(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<CampsiteResponse> campsites = campsiteService.searchCampsites(q, type, minPrice, maxPrice);
        return ResponseEntity.ok(Map.of(
            "campsites", campsites,
            "total", campsites.size()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, CampsiteResponse>> getCampsite(@PathVariable UUID id) {
        CampsiteResponse campsite = campsiteService.getCampsite(id);
        return ResponseEntity.ok(Map.of("campsite", campsite));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(@PathVariable UUID id) {
        Map<String, Object> availability = campsiteService.getAvailability(id);
        return ResponseEntity.ok(availability);
    }
}
