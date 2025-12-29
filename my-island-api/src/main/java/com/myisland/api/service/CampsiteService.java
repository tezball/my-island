package com.myisland.api.service;

import com.myisland.api.dto.response.CampsiteResponse;
import com.myisland.api.entity.Campsite;
import com.myisland.api.exception.ResourceNotFoundException;
import com.myisland.api.repository.CampsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CampsiteService {

    private final CampsiteRepository campsiteRepository;

    public List<CampsiteResponse> searchCampsites(
        String query,
        String type,
        BigDecimal minPrice,
        BigDecimal maxPrice
    ) {
        Campsite.CampsiteType campsiteType = null;
        if (type != null && !type.isEmpty()) {
            try {
                campsiteType = Campsite.CampsiteType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        List<Campsite> campsites = campsiteRepository.searchCampsites(
            query, campsiteType, minPrice, maxPrice
        );

        return campsites.stream()
            .map(CampsiteResponse::from)
            .toList();
    }

    public CampsiteResponse getCampsite(UUID id) {
        Campsite campsite = campsiteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Campsite", id.toString()));

        return CampsiteResponse.from(campsite);
    }

    public Map<String, Object> getAvailability(UUID campsiteId) {
        // Check campsite exists
        if (!campsiteRepository.existsById(campsiteId)) {
            throw new ResourceNotFoundException("Campsite", campsiteId.toString());
        }

        // For now, return some mock unavailable dates
        // In production, this would query the bookings table
        List<String> unavailableDates = Arrays.asList(
            LocalDate.now().plusDays(5).toString(),
            LocalDate.now().plusDays(6).toString(),
            LocalDate.now().plusDays(12).toString(),
            LocalDate.now().plusDays(13).toString(),
            LocalDate.now().plusDays(14).toString()
        );

        return Map.of(
            "campsiteId", campsiteId.toString(),
            "unavailableDates", unavailableDates
        );
    }
}
