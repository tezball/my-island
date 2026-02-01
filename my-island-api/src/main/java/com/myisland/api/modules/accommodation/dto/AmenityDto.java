package com.myisland.api.modules.accommodation.dto;

import com.myisland.api.modules.accommodation.entity.Amenity;

public record AmenityDto(
        Long id,
        String name,
        String icon,
        String category
) {
    public static AmenityDto from(Amenity amenity) {
        return new AmenityDto(
                amenity.getId(),
                amenity.getName(),
                amenity.getIcon(),
                amenity.getCategory().name()
        );
    }
}
