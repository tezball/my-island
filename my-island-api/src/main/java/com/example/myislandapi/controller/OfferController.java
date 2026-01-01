package com.example.myislandapi.controller;

import com.example.myislandapi.dto.response.OfferResponse;
import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.service.OfferService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @GetMapping
    public ResponseEntity<Page<OfferResponse>> getOffers(
            @RequestParam(required = false) OfferCategory category,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(offerService.getOffers(category, pageable));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<OfferResponse>> getFeaturedOffers(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(offerService.getFeaturedOffers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOffer(@PathVariable UUID id) {
        return ResponseEntity.ok(offerService.getOffer(id));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<OfferResponse>> getNearbyOffers(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") double radius) {
        return ResponseEntity.ok(offerService.getOffersNearLocation(lat, lng, radius));
    }
}
