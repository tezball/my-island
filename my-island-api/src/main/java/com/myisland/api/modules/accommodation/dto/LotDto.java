package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.Lot;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

public record LotDto(
        Long id,
        Long ownerId,
        String ownerPropertyName,
        String name,
        String lotType,
        String description,
        BigDecimal pricePerNight,
        int maxGuests,
        boolean isActive,
        String imageUrl,
        Set<AmenityDto> amenities
) {
    public static LotDto from(Lot lot) {
        return new LotDto(
                lot.getId(),
                lot.getOwner().getId(),
                lot.getOwner().getPropertyName(),
                lot.getName(),
                lot.getLotType().name(),
                lot.getDescription(),
                lot.getPricePerNight(),
                lot.getMaxGuests(),
                lot.isActive(),
                lot.getImageUrl(),
                lot.getAmenities().stream()
                        .map(AmenityDto::from)
                        .collect(Collectors.toSet())
        );
    }
}
