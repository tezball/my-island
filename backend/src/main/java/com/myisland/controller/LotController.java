package com.myisland.controller;

import com.myisland.dto.CreateLotRequest;
import com.myisland.dto.ErrorResponse;
import com.myisland.dto.UpdateLotRequest;
import com.myisland.model.CampsiteLot;
import com.myisland.model.User;
import com.myisland.repository.LotRepository;
import com.myisland.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/lots")
public class LotController {
    private final LotRepository lotRepository;
    private final AuthService authService;

    public LotController(LotRepository lotRepository, AuthService authService) {
        this.lotRepository = lotRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getLots() {
        List<CampsiteLot> lots = List.copyOf(lotRepository.findAll());
        return ResponseEntity.ok(Map.of("lots", lots));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLot(@PathVariable String id) {
        Optional<CampsiteLot> lot = lotRepository.findById(id);
        if (lot.isPresent()) {
            return ResponseEntity.ok(Map.of("lot", lot.get()));
        }
        return ResponseEntity.status(404).body(new ErrorResponse("Lot not found"));
    }

    @PostMapping
    public ResponseEntity<?> createLot(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody CreateLotRequest request
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        CampsiteLot lot = CampsiteLot.builder()
                .name(request.getName())
                .type(request.getType())
                .maxGuests(request.getCapacity())
                .pricePerNight(request.getPrice())
                .status(request.getStatus() != null ? request.getStatus() : CampsiteLot.LotStatus.available)
                .image(request.getImage())
                .amenities(request.getAmenities())
                .build();

        CampsiteLot savedLot = lotRepository.save(lot);
        return ResponseEntity.status(201).body(Map.of("lot", savedLot));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateLot(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id,
            @RequestBody UpdateLotRequest request
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        Optional<CampsiteLot> lotOpt = lotRepository.findById(id);
        if (lotOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ErrorResponse("Lot not found"));
        }

        CampsiteLot lot = lotOpt.get();
        if (request.getName() != null) {
            lot.setName(request.getName());
        }
        if (request.getPrice() != null) {
            lot.setPricePerNight(request.getPrice());
        }
        if (request.getStatus() != null) {
            lot.setStatus(request.getStatus());
        }
        if (request.getAmenities() != null) {
            lot.setAmenities(request.getAmenities());
        }

        CampsiteLot savedLot = lotRepository.save(lot);
        return ResponseEntity.ok(Map.of("lot", savedLot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLot(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id
    ) {
        Optional<User> userOpt = authService.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Not authenticated"));
        }

        if (!lotRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ErrorResponse("Lot not found"));
        }

        lotRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
