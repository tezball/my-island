package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.FavoriteModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.event.FavoriteEvent;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcFavoriteRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.UUID;

@Service
@Transactional
public class FavoriteService {

    private final JdbcFavoriteRepository favoriteRepository;
    private final JdbcUserRepository userRepository;
    private final JdbcCampsiteRepository campsiteRepository;
    private final JdbcLotRepository lotRepository;
    private final EventPublisher eventPublisher;

    public FavoriteService(JdbcFavoriteRepository favoriteRepository,
                          JdbcUserRepository userRepository,
                          JdbcCampsiteRepository campsiteRepository,
                          JdbcLotRepository lotRepository,
                          EventPublisher eventPublisher) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
        this.lotRepository = lotRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public Page<CampsiteResponse> getUserFavorites(UUID userId, Pageable pageable) {
        return favoriteRepository.findByUserId(userId, pageable)
                .map(favorite -> {
                    CampsiteModel campsite = campsiteRepository.findById(favorite.getCampsiteId())
                            .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + favorite.getCampsiteId()));
                    return toCampsiteResponse(campsite);
                });
    }

    public void addFavorite(UUID userId, UUID campsiteId) {
        if (favoriteRepository.existsByUserIdAndCampsiteId(userId, campsiteId)) {
            throw new BadRequestException("Campsite already in favorites");
        }

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }

        if (!campsiteRepository.existsById(campsiteId)) {
            throw new ResourceNotFoundException("Campsite not found: " + campsiteId);
        }

        FavoriteModel favorite = new FavoriteModel();
        favorite.setUserId(userId);
        favorite.setCampsiteId(campsiteId);
        favoriteRepository.save(favorite);

        // Publish favorite added event
        eventPublisher.publishFavoriteEvent(FavoriteEvent.added(userId, campsiteId));
    }

    public void removeFavorite(UUID userId, UUID campsiteId) {
        if (!favoriteRepository.existsByUserIdAndCampsiteId(userId, campsiteId)) {
            throw new ResourceNotFoundException("Favorite not found");
        }
        favoriteRepository.deleteByUserIdAndCampsiteId(userId, campsiteId);

        // Publish favorite removed event
        eventPublisher.publishFavoriteEvent(FavoriteEvent.removed(userId, campsiteId));
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(UUID userId, UUID campsiteId) {
        return favoriteRepository.existsByUserIdAndCampsiteId(userId, campsiteId);
    }

    private CampsiteResponse toCampsiteResponse(CampsiteModel campsite) {
        var lots = lotRepository.findByCampsiteId(campsite.getId());
        BigDecimal priceFrom = lots.stream()
                .map(LotModel::getPricePerNight)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        LocationResponse locationResponse = null;
        if (campsite.getLocation() != null) {
            locationResponse = new LocationResponse(
                    campsite.getLocation().getAddress(),
                    campsite.getLocation().getCounty(),
                    campsite.getLocation().getLat(),
                    campsite.getLocation().getLng()
            );
        }

        return new CampsiteResponse(
                campsite.getId(),
                campsite.getName(),
                campsite.getDescription(),
                locationResponse,
                campsite.getImages(),
                campsite.getRating(),
                campsite.getReviewCount(),
                priceFrom,
                campsite.getFacilities(),
                campsite.isFeatured(),
                campsite.getOwnerId()
        );
    }
}
