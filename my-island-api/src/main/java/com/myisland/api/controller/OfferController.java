package com.myisland.api.controller;

import com.myisland.api.dto.response.OfferResponse;
import com.myisland.api.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listOffers(
        @RequestParam(required = false) String category
    ) {
        List<OfferResponse> offers = offerService.getOffers(category);
        return ResponseEntity.ok(Map.of(
            "offers", offers,
            "total", offers.size()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, OfferResponse>> getOffer(@PathVariable UUID id) {
        OfferResponse offer = offerService.getOffer(id);
        return ResponseEntity.ok(Map.of("offer", offer));
    }
}
