package com.myisland.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "campsite_lots")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CampsiteLot {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campsite_id", nullable = false)
    private Campsite campsite;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LotType type;

    @Column(nullable = false)
    private Integer maxGuests;

    private String size;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    public enum LotType {
        TENT, RV, CABIN, GLAMPING
    }
}
