package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.OfferResponse;
import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.OfferModel;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcOfferRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class OfferService {

    private final JdbcOfferRepository offerRepository;
    private final JdbcCampsiteRepository campsiteRepository;

    public OfferService(JdbcOfferRepository offerRepository, JdbcCampsiteRepository campsiteRepository) {
        this.offerRepository = offerRepository;
        this.campsiteRepository = campsiteRepository;
    }

    public Page<OfferResponse> getOffers(OfferCategory category, Pageable pageable) {
        Page<OfferModel> offers;
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
        OfferModel offer = offerRepository.findById(id)
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

    private OfferResponse toOfferResponse(OfferModel offer) {
        String campsiteName = null;
        if (offer.getCampsiteId() != null) {
            CampsiteModel campsite = campsiteRepository.findById(offer.getCampsiteId()).orElse(null);
            if (campsite != null) {
                campsiteName = campsite.getName();
            }
        }

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
                offer.getCampsiteId(),
                campsiteName
        );
    }
}
