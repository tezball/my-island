package com.myisland.dto;

import com.myisland.model.CampsiteLot;

import java.util.List;

public class UpdateLotRequest {
    private String name;
    private Double price;
    private CampsiteLot.LotStatus status;
    private List<String> amenities;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public CampsiteLot.LotStatus getStatus() { return status; }
    public void setStatus(CampsiteLot.LotStatus status) { this.status = status; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
}
