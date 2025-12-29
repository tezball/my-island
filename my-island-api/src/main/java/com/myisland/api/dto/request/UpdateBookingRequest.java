package com.myisland.api.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class UpdateBookingRequest {
    private String checkIn;
    private String checkOut;
    private Integer adults;
    private Integer children;
    private List<String> extras;
}
