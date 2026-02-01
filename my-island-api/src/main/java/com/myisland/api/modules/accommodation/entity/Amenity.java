package com.myisland.api.modules.accommodation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "amenities")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmenityCategory category;

    public enum AmenityCategory {
        FACILITY, ACTIVITY, SERVICE, FEATURE
    }

    public Amenity() {}

    public Amenity(Long id, String name, String icon, AmenityCategory category) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.category = category;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String icon;
        private AmenityCategory category;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder category(AmenityCategory category) { this.category = category; return this; }

        public Amenity build() {
            return new Amenity(id, name, icon, category);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public AmenityCategory getCategory() { return category; }
    public void setCategory(AmenityCategory category) { this.category = category; }
}
