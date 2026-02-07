package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.Owner;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public record OwnerDto(
        Long id,
        String propertyName,
        String county,
        String town,
        String propertyType,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        String phone,
        String website,
        Set<AmenityDto> amenities,
        int lotCount,
        boolean isFeatured,
        LocalDateTime featuredUntil,
        boolean isAcceptingBookings,
        BigDecimal rating,
        int reviewCount
) {
    public static OwnerDto from(Owner owner) {
        return new OwnerDto(
                owner.getId(),
                owner.getPropertyName(),
                owner.getCounty(),
                owner.getTown(),
                owner.getPropertyType().name(),
                owner.getDescription(),
                owner.getLatitude(),
                owner.getLongitude(),
                owner.getPhone(),
                owner.getWebsite(),
                owner.getAmenities().stream()
                        .map(AmenityDto::from)
                        .collect(Collectors.toSet()),
                owner.getLots().size(),
                owner.isCurrentlyFeatured(),
                owner.getFeaturedUntil(),
                owner.hasActiveSubscription(),
                owner.getRating(),
                owner.getReviewCount()
        );
    }
}
