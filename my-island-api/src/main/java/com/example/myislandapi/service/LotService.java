package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.AutoAssignLotRequest;
import com.example.myislandapi.dto.request.CreateLotRequest;
import com.example.myislandapi.dto.request.UpdateLotRequest;
import com.example.myislandapi.dto.response.AutoAssignLotResponse;
import com.example.myislandapi.dto.response.LotResponse;
import com.example.myislandapi.dto.response.LotTypeAggregationResponse;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.exception.UnauthorizedException;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.LotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class LotService {

    private final LotRepository lotRepository;
    private final CampsiteRepository campsiteRepository;
    private final AvailabilityService availabilityService;

    public LotService(LotRepository lotRepository, CampsiteRepository campsiteRepository,
                      AvailabilityService availabilityService) {
        this.lotRepository = lotRepository;
        this.campsiteRepository = campsiteRepository;
        this.availabilityService = availabilityService;
    }

    public LotResponse getLotById(UUID id) {
        Lot lot = lotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", "id", id));
        return toLotResponse(lot);
    }

    public List<LotResponse> getLotsByCampsiteId(UUID campsiteId) {
        return lotRepository.findByCampsiteId(campsiteId).stream()
                .map(this::toLotResponse)
                .toList();
    }

    @Transactional
    public LotResponse createLot(UUID ownerId, CreateLotRequest request) {
        Campsite campsite = campsiteRepository.findById(request.campsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", "id", request.campsiteId()));

        if (!campsite.getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to add lots to this campsite");
        }

        Lot lot = new Lot();
        lot.setCampsite(campsite);
        lot.setName(request.name());
        lot.setType(request.type());
        lot.setCapacity(request.capacity());
        lot.setPricePerNight(request.pricePerNight());
        lot.setImages(request.images() != null ? new ArrayList<>(request.images()) : new ArrayList<>());
        lot.setAmenities(request.amenities() != null ? new ArrayList<>(request.amenities()) : new ArrayList<>());
        lot.setAvailable(request.available() != null ? request.available() : true);

        lot = lotRepository.save(lot);
        return toLotResponse(lot);
    }

    @Transactional
    public LotResponse updateLot(UUID lotId, UUID ownerId, UpdateLotRequest request) {
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", "id", lotId));

        if (!lot.getCampsite().getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to update this lot");
        }

        if (request.name() != null) {
            lot.setName(request.name());
        }
        if (request.type() != null) {
            lot.setType(request.type());
        }
        if (request.capacity() != null) {
            lot.setCapacity(request.capacity());
        }
        if (request.pricePerNight() != null) {
            lot.setPricePerNight(request.pricePerNight());
        }
        if (request.images() != null) {
            lot.setImages(new ArrayList<>(request.images()));
        }
        if (request.amenities() != null) {
            lot.setAmenities(new ArrayList<>(request.amenities()));
        }
        if (request.available() != null) {
            lot.setAvailable(request.available());
        }

        lot = lotRepository.save(lot);
        return toLotResponse(lot);
    }

    @Transactional
    public void deleteLot(UUID lotId, UUID ownerId) {
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", "id", lotId));

        if (!lot.getCampsite().getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to delete this lot");
        }

        lotRepository.delete(lot);
    }

    private LotResponse toLotResponse(Lot lot) {
        return new LotResponse(
                lot.getId(),
                lot.getName(),
                lot.getType(),
                lot.getCapacity(),
                lot.getPricePerNight(),
                lot.getImages(),
                lot.getAmenities(),
                lot.isAvailable()
        );
    }

    public List<LotTypeAggregationResponse> getLotTypesByCampsiteId(UUID campsiteId) {
        List<Lot> allLots = lotRepository.findByCampsiteId(campsiteId);

        Map<LotType, List<Lot>> lotsByType = allLots.stream()
                .collect(Collectors.groupingBy(Lot::getType));

        return lotsByType.entrySet().stream()
                .map(entry -> {
                    LotType type = entry.getKey();
                    List<Lot> typeLots = entry.getValue();

                    int totalCount = typeLots.size();
                    int availableCount = (int) typeLots.stream().filter(Lot::isAvailable).count();

                    BigDecimal minPrice = typeLots.stream()
                            .map(Lot::getPricePerNight)
                            .min(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);

                    BigDecimal maxPrice = typeLots.stream()
                            .map(Lot::getPricePerNight)
                            .max(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);

                    int maxCapacity = typeLots.stream()
                            .mapToInt(Lot::getCapacity)
                            .max()
                            .orElse(0);

                    String representativeImage = typeLots.stream()
                            .filter(l -> l.getImages() != null && !l.getImages().isEmpty())
                            .findFirst()
                            .map(l -> l.getImages().get(0))
                            .orElse("");

                    Set<String> allAmenities = new HashSet<>();
                    typeLots.forEach(l -> {
                        if (l.getAmenities() != null) {
                            allAmenities.addAll(l.getAmenities());
                        }
                    });
                    List<String> commonAmenities = new ArrayList<>(allAmenities);
                    if (commonAmenities.size() > 4) {
                        commonAmenities = commonAmenities.subList(0, 4);
                    }

                    return new LotTypeAggregationResponse(
                            type,
                            totalCount,
                            availableCount,
                            minPrice,
                            maxPrice,
                            maxCapacity,
                            representativeImage,
                            commonAmenities
                    );
                })
                .sorted((a, b) -> Integer.compare(b.availableCount(), a.availableCount()))
                .toList();
    }

    public AutoAssignLotResponse autoAssignLot(AutoAssignLotRequest request) {
        List<Lot> candidateLots = lotRepository.findByCampsiteIdAndTypeAndAvailableTrueOrderByPricePerNightAsc(
                request.campsiteId(), request.type());

        if (candidateLots.isEmpty()) {
            throw new ResourceNotFoundException("No available lots of type " + request.type() + " found");
        }

        for (Lot lot : candidateLots) {
            if (lot.getCapacity() < request.guests()) {
                continue;
            }

            boolean available = availabilityService.isAvailable(
                    lot.getId(), request.checkIn(), request.checkOut());

            if (available) {
                return new AutoAssignLotResponse(
                        lot.getId(),
                        lot.getName(),
                        lot.getType(),
                        lot.getCapacity(),
                        lot.getPricePerNight(),
                        lot.getImages(),
                        lot.getAmenities()
                );
            }
        }

        throw new ResourceNotFoundException(
                "No available lots of type " + request.type() + " for the selected dates and guest count");
    }
}
