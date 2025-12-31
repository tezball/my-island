package com.myisland.controller;

import com.myisland.dto.ErrorResponse;
import com.myisland.model.SupplierOffer;
import com.myisland.repository.OfferRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {
    private final OfferRepository offerRepository;

    public OfferController(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    @GetMapping
    public ResponseEntity<?> getOffers(@RequestParam(required = false) String category) {
        List<SupplierOffer> offers;

        if (category != null && !category.isEmpty() && !category.equals("all")) {
            try {
                SupplierOffer.OfferCategory cat = SupplierOffer.OfferCategory.valueOf(category);
                offers = offerRepository.findByCategory(cat);
            } catch (IllegalArgumentException e) {
                offers = List.copyOf(offerRepository.findAll());
            }
        } else {
            offers = List.copyOf(offerRepository.findAll());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("offers", offers);
        response.put("total", offers.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOffer(@PathVariable String id) {
        Optional<SupplierOffer> offer = offerRepository.findById(id);
        if (offer.isPresent()) {
            return ResponseEntity.ok(Map.of("offer", offer.get()));
        }
        return ResponseEntity.status(404).body(new ErrorResponse("Offer not found"));
    }
}
