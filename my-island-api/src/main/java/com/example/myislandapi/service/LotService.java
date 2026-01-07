package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.AutoAssignLotRequest;
import com.example.myislandapi.dto.request.CreateLotRequest;
import com.example.myislandapi.dto.request.UpdateLotRequest;
import com.example.myislandapi.dto.response.AutoAssignLotResponse;
import com.example.myislandapi.dto.response.LotResponse;
import com.example.myislandapi.dto.response.LotTypeAggregationResponse;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.exception.UnauthorizedException;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
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

    private final JdbcLotRepository lotRepository;
    private final JdbcCampsiteRepository campsiteRepository;
    private final AvailabilityService availabilityService;

    public LotService(JdbcLotRepository lotRepository, JdbcCampsiteRepository campsiteRepository,
                      AvailabilityService availabilityService) {
        this.lotRepository = lotRepository;
        this.campsiteRepository = campsiteRepository;
        this.availabilityService = availabilityService;
    }

    public LotResponse getLotById(UUID id) {
        LotModel lot = lotRepository.findById(id)
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
        CampsiteModel campsite = campsiteRepository.findById(request.campsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", "id", request.campsiteId()));

        if (!campsite.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to add lots to this campsite");
        }

        LotModel lot = new LotModel();
        lot.setCampsiteId(campsite.getId());
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
        LotModel lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", "id", lotId));

        CampsiteModel campsite = campsiteRepository.findById(lot.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found"));

        if (!campsite.getOwnerId().equals(ownerId)) {
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
        LotModel lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", "id", lotId));

        CampsiteModel campsite = campsiteRepository.findById(lot.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found"));

        if (!campsite.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to delete this lot");
        }

        lotRepository.deleteById(lotId);
    }

    private LotResponse toLotResponse(LotModel lot) {
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
        List<LotModel> allLots = lotRepository.findByCampsiteId(campsiteId);

        Map<LotType, List<LotModel>> lotsByType = allLots.stream()
                .collect(Collectors.groupingBy(LotModel::getType));

        return lotsByType.entrySet().stream()
                .map(entry -> {
                    LotType type = entry.getKey();
                    List<LotModel> typeLots = entry.getValue();

                    int totalCount = typeLots.size();
                    int availableCount = (int) typeLots.stream().filter(LotModel::isAvailable).count();

                    BigDecimal minPrice = typeLots.stream()
                            .map(LotModel::getPricePerNight)
                            .min(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);

                    BigDecimal maxPrice = typeLots.stream()
                            .map(LotModel::getPricePerNight)
                            .max(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);

                    int maxCapacity = typeLots.stream()
                            .mapToInt(LotModel::getCapacity)
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
        List<LotModel> candidateLots = lotRepository.findByCampsiteIdAndTypeAndAvailableTrueOrderByPricePerNightAsc(
                request.campsiteId(), request.type());

        if (candidateLots.isEmpty()) {
            throw new ResourceNotFoundException("No available lots of type " + request.type() + " found");
        }

        for (LotModel lot : candidateLots) {
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
