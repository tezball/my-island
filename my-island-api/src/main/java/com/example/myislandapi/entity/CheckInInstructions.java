package com.example.myislandapi.entity;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "check_in_instructions")
public class CheckInInstructions extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campsite_id", nullable = false, unique = true)
    private Campsite campsite;

    @Column(name = "access_code")
    private String accessCode;

    @Column(name = "gate_code")
    private String gateCode;

    @Column(name = "wifi_name")
    private String wifiName;

    @Column(name = "wifi_password")
    private String wifiPassword;

    @Column(name = "check_in_time", nullable = false)
    private LocalTime checkInTime = LocalTime.of(14, 0);

    @Column(name = "check_out_time", nullable = false)
    private LocalTime checkOutTime = LocalTime.of(11, 0);

    @Column(length = 2000)
    private String directions;

    @Column(name = "parking_info", length = 500)
    private String parkingInfo;

    @Column(name = "host_name")
    private String hostName;

    @Column(name = "host_phone")
    private String hostPhone;

    @Column(name = "host_email")
    private String hostEmail;

    @Column(name = "host_avatar", length = 1000)
    private String hostAvatar;

    @Column(name = "host_response_time")
    private String hostResponseTime;

    @ElementCollection
    @CollectionTable(name = "check_in_rules", joinColumns = @JoinColumn(name = "instructions_id"))
    @Column(name = "rule")
    @OrderColumn(name = "sort_order")
    private List<String> rules = new ArrayList<>();

    public CheckInInstructions() {}

    public Campsite getCampsite() {
        return campsite;
    }

    public void setCampsite(Campsite campsite) {
        this.campsite = campsite;
    }

    public String getAccessCode() {
        return accessCode;
    }

    public void setAccessCode(String accessCode) {
        this.accessCode = accessCode;
    }

    public String getGateCode() {
        return gateCode;
    }

    public void setGateCode(String gateCode) {
        this.gateCode = gateCode;
    }

    public String getWifiName() {
        return wifiName;
    }

    public void setWifiName(String wifiName) {
        this.wifiName = wifiName;
    }

    public String getWifiPassword() {
        return wifiPassword;
    }

    public void setWifiPassword(String wifiPassword) {
        this.wifiPassword = wifiPassword;
    }

    public LocalTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public String getDirections() {
        return directions;
    }

    public void setDirections(String directions) {
        this.directions = directions;
    }

    public String getParkingInfo() {
        return parkingInfo;
    }

    public void setParkingInfo(String parkingInfo) {
        this.parkingInfo = parkingInfo;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getHostPhone() {
        return hostPhone;
    }

    public void setHostPhone(String hostPhone) {
        this.hostPhone = hostPhone;
    }

    public String getHostEmail() {
        return hostEmail;
    }

    public void setHostEmail(String hostEmail) {
        this.hostEmail = hostEmail;
    }

    public String getHostAvatar() {
        return hostAvatar;
    }

    public void setHostAvatar(String hostAvatar) {
        this.hostAvatar = hostAvatar;
    }

    public String getHostResponseTime() {
        return hostResponseTime;
    }

    public void setHostResponseTime(String hostResponseTime) {
        this.hostResponseTime = hostResponseTime;
    }

    public List<String> getRules() {
        return rules;
    }

    public void setRules(List<String> rules) {
        this.rules = rules;
    }
}
