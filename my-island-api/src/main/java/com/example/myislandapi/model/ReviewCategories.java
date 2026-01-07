package com.example.myislandapi.model;

/**
 * ReviewCategories model - POJO without JPA annotations.
 * Used to represent embedded review category ratings.
 */
public class ReviewCategories {

    private Integer cleanliness;
    private Integer location;
    private Integer value;
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
