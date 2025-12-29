package com.myisland.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "campsites")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Campsite {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(nullable = false)
    private Integer reviewCount;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean isSuperhost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampsiteType type;

    @ElementCollection
    @CollectionTable(name = "campsite_images", joinColumns = @JoinColumn(name = "campsite_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @OneToMany(mappedBy = "campsite", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CampsiteLot> lots = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "campsite_facilities",
        joinColumns = @JoinColumn(name = "campsite_id"),
        inverseJoinColumns = @JoinColumn(name = "facility_id")
    )
    @Builder.Default
    private Set<Facility> facilities = new HashSet<>();

    @OneToMany(mappedBy = "campsite", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LocalSupplier> suppliers = new ArrayList<>();

    public enum CampsiteType {
        TENT, RV, CABIN, GLAMPING
    }
}
