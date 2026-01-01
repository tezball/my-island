package com.example.myislandapi.dto.response;

public record LocationResponse(
    String address,
    String county,
    double lat,
    double lng
) {}
