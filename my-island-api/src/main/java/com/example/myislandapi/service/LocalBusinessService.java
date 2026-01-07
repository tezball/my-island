package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.LocalBusinessMapMarker;
import com.example.myislandapi.dto.response.LocalBusinessResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.enums.SupplierCategory;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.LocalBusinessModel;
import com.example.myislandapi.repository.jdbc.JdbcLocalBusinessRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class LocalBusinessService {

    private final JdbcLocalBusinessRepository repository;

    public LocalBusinessService(JdbcLocalBusinessRepository repository) {
        this.repository = repository;
    }

    public Page<LocalBusinessResponse> getAll(SupplierCategory category, String search, Pageable pageable) {
        Page<LocalBusinessModel> businesses;

        if (search != null && !search.isBlank()) {
            businesses = repository.searchByNameOrDescription(search.trim(), pageable);
        } else if (category != null) {
            businesses = repository.findByActiveTrueAndCategory(category, pageable);
        } else {
            businesses = repository.findByActiveTrue(pageable);
        }

        return businesses.map(this::toResponse);
    }

    public Page<LocalBusinessResponse> getFeatured(Pageable pageable) {
        return repository.findByActiveTrueAndFeaturedTrue(pageable).map(this::toResponse);
    }

    public LocalBusinessResponse getById(UUID id) {
        LocalBusinessModel business = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Local business not found: " + id));
        return toResponse(business);
    }

    public List<LocalBusinessMapMarker> getMapMarkers(
            Double minLat, Double maxLat, Double minLng, Double maxLng, SupplierCategory category) {

        List<LocalBusinessModel> businesses;
        if (category != null) {
            businesses = repository.findWithinBoundsAndCategory(category, minLat, maxLat, minLng, maxLng);
        } else {
            businesses = repository.findWithinBounds(minLat, maxLat, minLng, maxLng);
        }

        return businesses.stream()
                .map(this::toMapMarker)
                .toList();
    }

    public List<LocalBusinessResponse> getNearby(double lat, double lng, double radiusKm, SupplierCategory category) {
        // Convert radius to lat/lng delta (approximate)
        double latDelta = radiusKm / 111.0;
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        List<LocalBusinessModel> businesses;
        if (category != null) {
            businesses = repository.findWithinBoundsAndCategory(
                    category,
                    lat - latDelta, lat + latDelta,
                    lng - lngDelta, lng + lngDelta
            );
        } else {
            businesses = repository.findWithinBounds(
                    lat - latDelta, lat + latDelta,
                    lng - lngDelta, lng + lngDelta
            );
        }

        // Sort by distance
        return businesses.stream()
                .sorted((a, b) -> {
                    double distA = calculateDistance(lat, lng, a.getLocation().getLat(), a.getLocation().getLng());
                    double distB = calculateDistance(lat, lng, b.getLocation().getLat(), b.getLocation().getLng());
                    return Double.compare(distA, distB);
                })
                .map(this::toResponse)
                .toList();
    }

    public List<String> getCounties() {
        return repository.findDistinctCounties();
    }

    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private LocalBusinessResponse toResponse(LocalBusinessModel business) {
        return new LocalBusinessResponse(
                business.getId(),
                business.getName(),
                business.getCategory(),
                business.getDescription(),
                new LocationResponse(
                        business.getLocation().getAddress(),
                        business.getLocation().getCounty(),
                        business.getLocation().getLat(),
                        business.getLocation().getLng()
                ),
                new LocalBusinessResponse.ContactResponse(
                        business.getPhone(),
                        business.getEmail(),
                        business.getWebsite()
                ),
                new LocalBusinessResponse.HoursResponse(
                        business.getWeekdayHours(),
                        business.getWeekendHours()
                ),
                business.getImages(),
                business.getRating(),
                business.getReviewCount(),
                business.isFeatured()
        );
    }

    private LocalBusinessMapMarker toMapMarker(LocalBusinessModel business) {
        return new LocalBusinessMapMarker(
                business.getId(),
                business.getName(),
                business.getLocation().getLat(),
                business.getLocation().getLng(),
                business.getCategory()
        );
    }
}
