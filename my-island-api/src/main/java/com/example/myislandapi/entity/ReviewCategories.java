package com.example.myislandapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ReviewCategories {

    @Column(name = "cleanliness_rating")
    private Integer cleanliness;

    @Column(name = "location_rating")
    private Integer location;

    @Column(name = "value_rating")
    private Integer value;

    @Column(name = "facilities_rating")
    private Integer facilities;

    public ReviewCategories() {
    }

    public ReviewCategories(Integer cleanliness, Integer location, Integer value, Integer facilities) {
        this.cleanliness = cleanliness;
        this.location = location;
        this.value = value;
        this.facilities = facilities;
    }

    public Integer getCleanliness() {
        return cleanliness;
    }

    public void setCleanliness(Integer cleanliness) {
        this.cleanliness = cleanliness;
    }

    public Integer getLocation() {
        return location;
    }

    public void setLocation(Integer location) {
        this.location = location;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public Integer getFacilities() {
        return facilities;
    }

    public void setFacilities(Integer facilities) {
        this.facilities = facilities;
    }
}
