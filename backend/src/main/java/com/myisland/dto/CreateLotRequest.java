package com.myisland.dto;

import com.myisland.model.CampsiteLot;

import java.util.List;

public class CreateLotRequest {
    private String name;
    private CampsiteLot.LotType type;
    private int capacity;
    private double price;
    private CampsiteLot.LotStatus status;
    private String image;
    private List<String> amenities;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public CampsiteLot.LotType getType() { return type; }
    public void setType(CampsiteLot.LotType type) { this.type = type; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public CampsiteLot.LotStatus getStatus() { return status; }
    public void setStatus(CampsiteLot.LotStatus status) { this.status = status; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
}
