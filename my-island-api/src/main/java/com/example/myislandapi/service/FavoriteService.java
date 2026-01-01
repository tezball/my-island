package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Favorite;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.FavoriteRepository;
import com.example.myislandapi.repository.UserRepository;
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

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final CampsiteRepository campsiteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
                          UserRepository userRepository,
                          CampsiteRepository campsiteRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
    }

    @Transactional(readOnly = true)
    public Page<CampsiteResponse> getUserFavorites(UUID userId, Pageable pageable) {
        return favoriteRepository.findByUserId(userId, pageable)
                .map(favorite -> toCampsiteResponse(favorite.getCampsite()));
    }

    public void addFavorite(UUID userId, UUID campsiteId) {
        if (favoriteRepository.existsByUserIdAndCampsiteId(userId, campsiteId)) {
            throw new BadRequestException("Campsite already in favorites");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Campsite campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + campsiteId));

        Favorite favorite = new Favorite(user, campsite);
        favoriteRepository.save(favorite);
    }

    public void removeFavorite(UUID userId, UUID campsiteId) {
        if (!favoriteRepository.existsByUserIdAndCampsiteId(userId, campsiteId)) {
            throw new ResourceNotFoundException("Favorite not found");
        }
        favoriteRepository.deleteByUserIdAndCampsiteId(userId, campsiteId);
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(UUID userId, UUID campsiteId) {
        return favoriteRepository.existsByUserIdAndCampsiteId(userId, campsiteId);
    }

    private CampsiteResponse toCampsiteResponse(Campsite campsite) {
        BigDecimal priceFrom = campsite.getLots().stream()
                .map(Lot::getPricePerNight)
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
                campsite.getOwner().getId()
        );
    }
}
