package com.myisland.api.dto.response;

import com.myisland.api.entity.Booking;
import com.myisland.api.entity.Extra;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class BookingResponse {
    private String id;
    private String reference;
    private String campsiteId;
    private CampsiteResponse campsite;
    private String lotId;
    private CampsiteResponse.LotDto lot;
    private String checkIn;
    private String checkOut;
    private Long nights;
    private GuestsDto guests;
    private List<ExtraDto> extras;
    private String status;
    private BigDecimal totalPrice;
    private String createdAt;

    @Data @Builder
    public static class GuestsDto {
        private Integer adults;
        private Integer children;
    }

    @Data @Builder
    public static class ExtraDto {
        private String id;
        private String name;
        private String description;
        private BigDecimal price;
        private String icon;

        public static ExtraDto from(Extra e) {
            return ExtraDto.builder()
                .id(e.getId())
                .name(e.getName())
                .description(e.getDescription())
                .price(e.getPrice())
                .icon(e.getIcon())
                .build();
        }
    }

    public static BookingResponse from(Booking b) {
        return BookingResponse.builder()
            .id(b.getId().toString())
            .reference(b.getReference())
            .campsiteId(b.getCampsite().getId().toString())
            .campsite(CampsiteResponse.from(b.getCampsite()))
            .lotId(b.getLot().getId().toString())
            .lot(CampsiteResponse.LotDto.from(b.getLot()))
            .checkIn(b.getCheckIn().toString())
            .checkOut(b.getCheckOut().toString())
            .nights(b.getNights())
            .guests(GuestsDto.builder()
                .adults(b.getAdults())
                .children(b.getChildren())
                .build())
            .extras(b.getExtras().stream().map(ExtraDto::from).collect(Collectors.toList()))
            .status(b.getStatus().name().toLowerCase())
            .totalPrice(b.getTotalPrice())
            .createdAt(b.getCreatedAt().toString())
            .build();
    }
}
