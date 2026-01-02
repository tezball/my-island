package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateCampsiteRequest;
import com.example.myislandapi.dto.request.UpdateCampsiteRequest;
import com.example.myislandapi.dto.response.CampsiteDetailResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.dto.response.LotResponse;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Location;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.Facility;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.exception.UnauthorizedException;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.FavoriteRepository;
import com.example.myislandapi.repository.LotRepository;
import com.example.myislandapi.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CampsiteService {

    private final CampsiteRepository campsiteRepository;
    private final LotRepository lotRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    public CampsiteService(CampsiteRepository campsiteRepository,
                          LotRepository lotRepository,
                          FavoriteRepository favoriteRepository,
                          UserRepository userRepository) {
        this.campsiteRepository = campsiteRepository;
        this.lotRepository = lotRepository;
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
    }

    public Page<CampsiteResponse> getAllCampsites(Pageable pageable) {
        return campsiteRepository.findByActiveTrue(pageable)
                .map(this::toCampsiteResponse);
    }

    public Page<CampsiteResponse> getFeaturedCampsites(Pageable pageable) {
        return campsiteRepository.findByActiveTrueAndFeaturedTrue(pageable)
                .map(this::toCampsiteResponse);
    }

    public Page<CampsiteResponse> searchCampsites(String county, String search, Set<String> facilities, Pageable pageable) {
        String searchLower = search != null ? search.toLowerCase() : null;

        // Convert string facility names to Facility enums
        Set<Facility> facilityEnums = null;
        if (facilities != null && !facilities.isEmpty()) {
            facilityEnums = facilities.stream()
                    .map(name -> {
                        try {
                            return Facility.valueOf(name.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            return null;
                        }
                    })
                    .filter(f -> f != null)
                    .collect(Collectors.toSet());
        }

        long facilityCount = facilityEnums != null ? facilityEnums.size() : 0;
        return campsiteRepository.search(county, searchLower, facilityEnums, facilityCount, pageable)
                .map(this::toCampsiteResponse);
    }

    public Page<CampsiteResponse> getCampsitesByCounty(String county, Pageable pageable) {
        return campsiteRepository.findByCounty(county, pageable)
                .map(this::toCampsiteResponse);
    }

    public CampsiteDetailResponse getCampsiteById(UUID id, UUID userId) {
        Campsite campsite = campsiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + id));

        List<Lot> lots = lotRepository.findByCampsiteId(id);
        boolean isFavorite = userId != null && favoriteRepository.existsByUserIdAndCampsiteId(userId, id);

        return toCampsiteDetailResponse(campsite, lots, isFavorite);
    }

    public List<LotResponse> getLotsByCampsiteId(UUID campsiteId) {
        if (!campsiteRepository.existsById(campsiteId)) {
            throw new ResourceNotFoundException("Campsite not found: " + campsiteId);
        }
        return lotRepository.findByCampsiteId(campsiteId).stream()
                .map(this::toLotResponse)
                .toList();
    }

    public List<CampsiteResponse> getCampsitesInBoundingBox(double minLat, double maxLat,
                                                            double minLng, double maxLng) {
        return campsiteRepository.findInBoundingBox(minLat, maxLat, minLng, maxLng).stream()
                .map(this::toCampsiteResponse)
                .toList();
    }

    public List<CampsiteResponse> getOwnerCampsites(UUID ownerId) {
        return campsiteRepository.findByOwnerId(ownerId).stream()
                .map(this::toCampsiteResponse)
                .toList();
    }

    @Transactional
    public CampsiteDetailResponse createCampsite(UUID ownerId, CreateCampsiteRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));

        if (!owner.isOwner()) {
            throw new BadRequestException("User is not registered as an owner");
        }

        Campsite campsite = new Campsite();
        campsite.setName(request.name());
        campsite.setDescription(request.description());
        campsite.setLocation(new Location(
                request.location().address(),
                request.location().county(),
                request.location().lat(),
                request.location().lng()
        ));
        campsite.setImages(request.images() != null ? new ArrayList<>(request.images()) : new ArrayList<>());
        campsite.setFacilities(request.facilities() != null ? new HashSet<>(request.facilities()) : new HashSet<>());
        campsite.setOwner(owner);
        campsite.setActive(true);

        campsite = campsiteRepository.save(campsite);
        return toCampsiteDetailResponse(campsite, new ArrayList<>(), false);
    }

    @Transactional
    public CampsiteDetailResponse updateCampsite(UUID campsiteId, UUID ownerId, UpdateCampsiteRequest request) {
        Campsite campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", "id", campsiteId));

        if (!campsite.getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to update this campsite");
        }

        if (request.name() != null) {
            campsite.setName(request.name());
        }
        if (request.description() != null) {
            campsite.setDescription(request.description());
        }
        if (request.location() != null) {
            Location loc = campsite.getLocation();
            if (loc == null) {
                loc = new Location();
                campsite.setLocation(loc);
            }
            if (request.location().address() != null) {
                loc.setAddress(request.location().address());
            }
            if (request.location().county() != null) {
                loc.setCounty(request.location().county());
            }
            if (request.location().lat() != null) {
                loc.setLat(request.location().lat());
            }
            if (request.location().lng() != null) {
                loc.setLng(request.location().lng());
            }
        }
        if (request.images() != null) {
            campsite.setImages(new ArrayList<>(request.images()));
        }
        if (request.facilities() != null) {
            campsite.setFacilities(new HashSet<>(request.facilities()));
        }
        if (request.active() != null) {
            campsite.setActive(request.active());
        }

        campsite = campsiteRepository.save(campsite);
        List<Lot> lots = lotRepository.findByCampsiteId(campsiteId);
        return toCampsiteDetailResponse(campsite, lots, false);
    }

    @Transactional
    public void deleteCampsite(UUID campsiteId, UUID ownerId) {
        Campsite campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", "id", campsiteId));

        if (!campsite.getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to delete this campsite");
        }

        campsiteRepository.delete(campsite);
    }

    private CampsiteResponse toCampsiteResponse(Campsite campsite) {
        // Use pricePerNight from campsite if available, otherwise calculate from lots
        BigDecimal priceFrom = campsite.getPricePerNight();
        if (priceFrom == null || priceFrom.equals(BigDecimal.ZERO)) {
            List<Lot> lots = lotRepository.findByCampsiteId(campsite.getId());
            priceFrom = lots.stream()
                    .map(Lot::getPricePerNight)
                    .min(Comparator.naturalOrder())
                    .orElse(BigDecimal.ZERO);
        }

        return new CampsiteResponse(
                campsite.getId(),
                campsite.getName(),
                campsite.getDescription(),
                toLocationResponse(campsite),
                campsite.getImages(),
                campsite.getRating(),
                campsite.getReviewCount(),
                priceFrom,
                campsite.getFacilities(),
                campsite.isFeatured(),
                campsite.getOwner().getId()
        );
    }

    private CampsiteDetailResponse toCampsiteDetailResponse(Campsite campsite, List<Lot> lots, boolean isFavorite) {
        BigDecimal priceFrom = lots.stream()
                .map(Lot::getPricePerNight)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        List<LotResponse> lotResponses = lots.stream()
                .map(this::toLotResponse)
                .toList();

        return new CampsiteDetailResponse(
                campsite.getId(),
                campsite.getName(),
                campsite.getDescription(),
                toLocationResponse(campsite),
                campsite.getImages(),
                campsite.getRating(),
                campsite.getReviewCount(),
                priceFrom,
                campsite.getFacilities(),
                campsite.isFeatured(),
                campsite.getOwner().getId(),
                lotResponses,
                isFavorite
        );
    }

    private LocationResponse toLocationResponse(Campsite campsite) {
        return new LocationResponse(
                campsite.getLocation().getAddress(),
                campsite.getLocation().getCounty(),
                campsite.getLocation().getLat(),
                campsite.getLocation().getLng()
        );
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
}
