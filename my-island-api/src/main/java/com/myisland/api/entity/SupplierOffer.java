package com.myisland.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "supplier_offers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SupplierOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private LocalSupplier supplier;

    @Column(nullable = false)
    private String supplierName;

    private String supplierLogo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferCategory category;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private String discount;

    private String location;

    private String distance;

    @ElementCollection
    @CollectionTable(name = "offer_tags", joinColumns = @JoinColumn(name = "offer_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    public enum OfferCategory {
        FOOD, ACTIVITY, GEAR, WATER, WELLNESS, EXPERIENCE, OTHER
    }
}
