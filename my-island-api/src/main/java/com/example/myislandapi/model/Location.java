package com.example.myislandapi.model;

/**
 * Location model - POJO without JPA annotations.
 * Used to represent embedded location data.
 */
public class Location {

    private String address;
    private String county;
    private Double lat;
    private Double lng;

    public Location() {
    }

    public Location(String address, String county, Double lat, Double lng) {
        this.address = address;
        this.county = county;
        this.lat = lat;
        this.lng = lng;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }
}
