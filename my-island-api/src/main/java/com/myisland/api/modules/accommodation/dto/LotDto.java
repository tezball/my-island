package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.shared.storage.EntityImage;

import java.math.BigDecimal;
import java.util.List;
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
        List<ImageDto> images,
        Set<AmenityDto> amenities
) {
    public static LotDto from(Lot lot) {
        return from(lot, List.of());
    }

    public static LotDto from(Lot lot, List<EntityImage> images) {
        // Use primary image URL or fall back to legacy imageUrl field
        String primaryUrl = images.stream()
                .filter(EntityImage::isPrimary)
                .findFirst()
                .map(EntityImage::getUrl)
                .orElse(lot.getImageUrl());

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
                primaryUrl,
                images.stream().map(ImageDto::from).collect(Collectors.toList()),
                lot.getAmenities().stream()
                        .map(AmenityDto::from)
                        .collect(Collectors.toSet())
        );
    }

    public record ImageDto(
            Long id,
            String url,
            String altText,
            int displayOrder,
            boolean isPrimary
    ) {
        public static ImageDto from(EntityImage image) {
            return new ImageDto(
                    image.getId(),
                    image.getUrl(),
                    image.getAltText(),
                    image.getDisplayOrder(),
                    image.isPrimary()
            );
        }
    }
}
