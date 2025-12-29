package com.myisland.api.dto.response;

import com.myisland.api.entity.Campsite;
import com.myisland.api.entity.CampsiteLot;
import com.myisland.api.entity.Facility;
import com.myisland.api.entity.LocalSupplier;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class CampsiteResponse {
    private String id;
    private String name;
    private String location;
    private CoordinatesDto coordinates;
    private BigDecimal pricePerNight;
    private BigDecimal rating;
    private Integer reviewCount;
    private String description;
    private String imageUrl;
    private List<String> images;
    private List<FacilityDto> facilities;
    private List<LotDto> lots;
    private List<SupplierDto> suppliers;
    private Boolean isSuperhost;
    private String type;

    @Data @Builder
    public static class CoordinatesDto {
        private Double lat;
        private Double lng;
    }

    @Data @Builder
    public static class FacilityDto {
        private String id;
        private String name;
        private String icon;

        public static FacilityDto from(Facility f) {
            return FacilityDto.builder()
                .id(f.getId())
                .name(f.getName())
                .icon(f.getIcon())
                .build();
        }
    }

    @Data @Builder
    public static class LotDto {
        private String id;
        private String name;
        private String type;
        private Integer maxGuests;
        private String size;
        private BigDecimal pricePerNight;

        public static LotDto from(CampsiteLot lot) {
            return LotDto.builder()
                .id(lot.getId().toString())
                .name(lot.getName())
                .type(lot.getType().name().toLowerCase())
                .maxGuests(lot.getMaxGuests())
                .size(lot.getSize())
                .pricePerNight(lot.getPricePerNight())
                .build();
        }
    }

    @Data @Builder
    public static class SupplierDto {
        private String id;
        private String name;
        private String category;
        private String distance;
        private Boolean alertsEnabled;

        public static SupplierDto from(LocalSupplier s) {
            return SupplierDto.builder()
                .id(s.getId().toString())
                .name(s.getName())
                .category(s.getCategory().name().toLowerCase())
                .distance(s.getDistance())
                .alertsEnabled(s.getAlertsEnabled())
                .build();
        }
    }

    public static CampsiteResponse from(Campsite c) {
        return CampsiteResponse.builder()
            .id(c.getId().toString())
            .name(c.getName())
            .location(c.getLocation())
            .coordinates(CoordinatesDto.builder()
                .lat(c.getLatitude())
                .lng(c.getLongitude())
                .build())
            .pricePerNight(c.getPricePerNight())
            .rating(c.getRating())
            .reviewCount(c.getReviewCount())
            .description(c.getDescription())
            .imageUrl(c.getImageUrl())
            .images(c.getImages())
            .facilities(c.getFacilities().stream().map(FacilityDto::from).collect(Collectors.toList()))
            .lots(c.getLots().stream().map(LotDto::from).collect(Collectors.toList()))
            .suppliers(c.getSuppliers().stream().map(SupplierDto::from).collect(Collectors.toList()))
            .isSuperhost(c.getIsSuperhost())
            .type(c.getType().name().toLowerCase())
            .build();
    }
}
