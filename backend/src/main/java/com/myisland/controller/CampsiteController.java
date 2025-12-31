package com.myisland.controller;

import com.myisland.dto.ErrorResponse;
import com.myisland.model.Campsite;
import com.myisland.model.CampsiteLot;
import com.myisland.repository.CampsiteRepository;
import com.myisland.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/campsites")
public class CampsiteController {
    private final CampsiteRepository campsiteRepository;
    private final BookingService bookingService;

    public CampsiteController(CampsiteRepository campsiteRepository, BookingService bookingService) {
        this.campsiteRepository = campsiteRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<?> getCampsites(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String types,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String amenities
    ) {
        List<CampsiteLot.LotType> typeList = null;

        if (type != null && !type.isEmpty()) {
            typeList = List.of(CampsiteLot.LotType.valueOf(type));
        } else if (types != null && !types.isEmpty()) {
            typeList = Arrays.stream(types.split(","))
                    .map(String::trim)
                    .map(CampsiteLot.LotType::valueOf)
                    .collect(Collectors.toList());
        }

        List<String> amenityList = null;
        if (amenities != null && !amenities.isEmpty()) {
            amenityList = Arrays.asList(amenities.split(","));
        }

        List<Campsite> campsites = campsiteRepository.findByFilters(
                q, typeList, minPrice, maxPrice, rating, amenityList
        );

        Map<String, Object> response = new HashMap<>();
        response.put("campsites", campsites);
        response.put("total", campsites.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCampsite(@PathVariable String id) {
        Optional<Campsite> campsite = campsiteRepository.findById(id);
        if (campsite.isPresent()) {
            return ResponseEntity.ok(Map.of("campsite", campsite.get()));
        }
        return ResponseEntity.status(404).body(new ErrorResponse("Campsite not found"));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<?> getAvailability(@PathVariable String id) {
        if (!campsiteRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ErrorResponse("Campsite not found"));
        }

        List<LocalDate> unavailableDates = bookingService.getUnavailableDates(id);
        List<String> formattedDates = unavailableDates.stream()
                .map(date -> date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("campsiteId", id);
        response.put("unavailableDates", formattedDates);

        return ResponseEntity.ok(response);
    }
}
