package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.CampsiteDetailResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.dto.response.LotResponse;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.FavoriteRepository;
import com.example.myislandapi.repository.LotRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CampsiteService {

    private final CampsiteRepository campsiteRepository;
    private final LotRepository lotRepository;
    private final FavoriteRepository favoriteRepository;

    public CampsiteService(CampsiteRepository campsiteRepository,
                          LotRepository lotRepository,
                          FavoriteRepository favoriteRepository) {
        this.campsiteRepository = campsiteRepository;
        this.lotRepository = lotRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public Page<CampsiteResponse> getAllCampsites(Pageable pageable) {
        return campsiteRepository.findByActiveTrue(pageable)
                .map(this::toCampsiteResponse);
    }

    public Page<CampsiteResponse> getFeaturedCampsites(Pageable pageable) {
        return campsiteRepository.findByActiveTrueAndFeaturedTrue(pageable)
                .map(this::toCampsiteResponse);
    }

    public Page<CampsiteResponse> searchCampsites(String county, String search, Pageable pageable) {
        return campsiteRepository.search(county, search, pageable)
                .map(this::toCampsiteResponse);
    }

    public Page<CampsiteResponse> getCampsitesByCounty(String county, Pageable pageable) {
        return campsiteRepository.findByCounty(county, pageable)
                .map(this::toCampsiteResponse);
    }

    public CampsiteDetailResponse getCampsiteById(UUID id, UUID userId) {
        Campsite campsite = campsiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + id));

        List<Lot> lots = lotRepository.findByCampsiteId(id);
        boolean isFavorite = userId != null && favoriteRepository.existsByUserIdAndCampsiteId(userId, id);

        return toCampsiteDetailResponse(campsite, lots, isFavorite);
    }

    public List<LotResponse> getLotsByCampsiteId(UUID campsiteId) {
        if (!campsiteRepository.existsById(campsiteId)) {
            throw new ResourceNotFoundException("Campsite not found: " + campsiteId);
        }
        return lotRepository.findByCampsiteId(campsiteId).stream()
                .map(this::toLotResponse)
                .toList();
    }

    public List<CampsiteResponse> getCampsitesInBoundingBox(double minLat, double maxLat,
                                                            double minLng, double maxLng) {
        return campsiteRepository.findInBoundingBox(minLat, maxLat, minLng, maxLng).stream()
                .map(this::toCampsiteResponse)
                .toList();
    }

    public List<CampsiteResponse> getOwnerCampsites(UUID ownerId) {
        return campsiteRepository.findByOwnerId(ownerId).stream()
                .map(this::toCampsiteResponse)
                .toList();
    }

    private CampsiteResponse toCampsiteResponse(Campsite campsite) {
        // Use pricePerNight from campsite if available, otherwise calculate from lots
        BigDecimal priceFrom = campsite.getPricePerNight();
        if (priceFrom == null || priceFrom.equals(BigDecimal.ZERO)) {
            List<Lot> lots = lotRepository.findByCampsiteId(campsite.getId());
            priceFrom = lots.stream()
                    .map(Lot::getPricePerNight)
                    .min(Comparator.naturalOrder())
                    .orElse(BigDecimal.ZERO);
        }

        return new CampsiteResponse(
                campsite.getId(),
                campsite.getName(),
                campsite.getDescription(),
                toLocationResponse(campsite),
                campsite.getImages(),
                campsite.getRating(),
                campsite.getReviewCount(),
                priceFrom,
                campsite.getFacilities(),
                campsite.isFeatured(),
                campsite.getOwner().getId()
        );
    }

    private CampsiteDetailResponse toCampsiteDetailResponse(Campsite campsite, List<Lot> lots, boolean isFavorite) {
        BigDecimal priceFrom = lots.stream()
                .map(Lot::getPricePerNight)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        List<LotResponse> lotResponses = lots.stream()
                .map(this::toLotResponse)
                .toList();

        return new CampsiteDetailResponse(
                campsite.getId(),
                campsite.getName(),
                campsite.getDescription(),
                toLocationResponse(campsite),
                campsite.getImages(),
                campsite.getRating(),
                campsite.getReviewCount(),
                priceFrom,
                campsite.getFacilities(),
                campsite.isFeatured(),
                campsite.getOwner().getId(),
                lotResponses,
                isFavorite
        );
    }

    private LocationResponse toLocationResponse(Campsite campsite) {
        return new LocationResponse(
                campsite.getLocation().getAddress(),
                campsite.getLocation().getCounty(),
                campsite.getLocation().getLat(),
                campsite.getLocation().getLng()
        );
    }

    private LotResponse toLotResponse(Lot lot) {
        return new LotResponse(
                lot.getId(),
                lot.getName(),
                lot.getType(),
                lot.getCapacity(),
                lot.getPricePerNight(),
                lot.getImages(),
                lot.getAmenities(),
                lot.isAvailable()
        );
    }
}
