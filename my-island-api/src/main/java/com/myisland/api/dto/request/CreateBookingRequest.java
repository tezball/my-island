package com.myisland.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateBookingRequest {
    @NotBlank
    private String campsiteId;

    @NotBlank
    private String lotId;

    @NotBlank
    private String checkIn;

    @NotBlank
    private String checkOut;

    @NotNull @Min(1)
    private Integer adults;

    @Min(0)
    private Integer children = 0;

    private List<String> extras;
}
