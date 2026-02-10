package com.myisland.api.modules.discovery.dto;

import com.myisland.api.modules.discovery.entity.PointOfInterest;

public record PoiDto(
        Long id,
        String name,
        String description,
        String category,
        double latitude,
        double longitude,
        String county,
        String town,
        String difficulty,
        Double distanceKm,
        String imageUrl,
        String websiteUrl
) {
    public static PoiDto from(PointOfInterest poi) {
        return new PoiDto(
                poi.getId(),
                poi.getName(),
                poi.getDescription(),
                poi.getCategory().name(),
                poi.getLatitude(),
                poi.getLongitude(),
                poi.getCounty(),
                poi.getTown(),
                poi.getDifficulty() != null ? poi.getDifficulty().name() : null,
                poi.getDistanceKm(),
                poi.getImageUrl(),
                poi.getWebsiteUrl()
        );
    }
}
