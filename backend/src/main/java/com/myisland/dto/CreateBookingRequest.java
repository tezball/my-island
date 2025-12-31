package com.myisland.dto;

import com.myisland.model.Guests;

import java.time.LocalDate;
import java.util.List;

public class CreateBookingRequest {
    private String campsiteId;
    private String lotId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Guests guests;
    private List<String> extras;

    public String getCampsiteId() { return campsiteId; }
    public void setCampsiteId(String campsiteId) { this.campsiteId = campsiteId; }
    public String getLotId() { return lotId; }
    public void setLotId(String lotId) { this.lotId = lotId; }
    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }
    public Guests getGuests() { return guests; }
    public void setGuests(Guests guests) { this.guests = guests; }
    public List<String> getExtras() { return extras; }
    public void setExtras(List<String> extras) { this.extras = extras; }
}
