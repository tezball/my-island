package com.example.myislandapi.dto.response;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record CheckInInstructionsResponse(
    UUID id,
    UUID campsiteId,
    String accessCode,
    String gateCode,
    String wifiName,
    String wifiPassword,
    LocalTime checkInTime,
    LocalTime checkOutTime,
    String directions,
    String parkingInfo,
    List<String> rules,
    HostContact hostContact
) {
    public record HostContact(
        String name,
        String phone,
        String email,
        String avatar,
        String responseTime
    ) {}
}
