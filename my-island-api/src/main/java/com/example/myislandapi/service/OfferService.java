package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.OfferResponse;
import com.example.myislandapi.entity.Offer;
import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.OfferRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class OfferService {

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public Page<OfferResponse> getOffers(OfferCategory category, Pageable pageable) {
        Page<Offer> offers;
        if (category != null) {
            offers = offerRepository.findByActiveTrueAndCategory(category, pageable);
        } else {
            offers = offerRepository.findByActiveTrue(pageable);
        }
        return offers.map(this::toOfferResponse);
    }

    public Page<OfferResponse> getFeaturedOffers(Pageable pageable) {
        return offerRepository.findByActiveTrueAndFeaturedTrue(pageable)
                .map(this::toOfferResponse);
    }

    public OfferResponse getOffer(UUID id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found: " + id));
        return toOfferResponse(offer);
    }

    public List<OfferResponse> getOffersNearLocation(double lat, double lng, double radiusKm) {
        double latDelta = radiusKm / 111.0;
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        return offerRepository.findNearLocation(
                lat - latDelta, lat + latDelta,
                lng - lngDelta, lng + lngDelta
        ).stream().map(this::toOfferResponse).toList();
    }

    private OfferResponse toOfferResponse(Offer offer) {
        return new OfferResponse(
                offer.getId(),
                offer.getTitle(),
                offer.getDescription(),
                offer.getCategory(),
                offer.getImageUrl(),
                offer.getOriginalPrice(),
                offer.getDiscountPrice(),
                offer.getDiscountPercent(),
                offer.getValidFrom(),
                offer.getValidUntil(),
                offer.getPromoCode(),
                offer.isFeatured(),
                offer.getCampsite() != null ? offer.getCampsite().getId() : null,
                offer.getCampsite() != null ? offer.getCampsite().getName() : null
        );
    }
}
