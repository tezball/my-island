package com.myisland.repository;

import com.myisland.model.Campsite;
import com.myisland.model.CampsiteLot;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class CampsiteRepository {
    private final Map<String, Campsite> campsites = new ConcurrentHashMap<>();

    public Optional<Campsite> findById(String id) {
        return Optional.ofNullable(campsites.get(id));
    }

    public Collection<Campsite> findAll() {
        return campsites.values();
    }

    public List<Campsite> findByFilters(String query, List<CampsiteLot.LotType> types,
                                        Double minPrice, Double maxPrice,
                                        Double minRating, List<String> amenities) {
        return campsites.values().stream()
                .filter(campsite -> {
                    // Search by name or location
                    if (query != null && !query.isEmpty()) {
                        String lowerQuery = query.toLowerCase();
                        if (!campsite.getName().toLowerCase().contains(lowerQuery) &&
                            !campsite.getLocation().toLowerCase().contains(lowerQuery)) {
                            return false;
                        }
                    }

                    // Filter by types
                    if (types != null && !types.isEmpty()) {
                        if (!types.contains(campsite.getType())) {
                            return false;
                        }
                    }

                    // Filter by price range
                    if (minPrice != null && campsite.getPricePerNight() < minPrice) {
                        return false;
                    }
                    if (maxPrice != null && campsite.getPricePerNight() > maxPrice) {
                        return false;
                    }

                    // Filter by rating
                    if (minRating != null && campsite.getRating() < minRating) {
                        return false;
                    }

                    // Filter by amenities (ANY match)
                    if (amenities != null && !amenities.isEmpty()) {
                        Set<String> facilityIds = campsite.getFacilities().stream()
                                .map(f -> f.id())
                                .collect(Collectors.toSet());
                        boolean hasAny = amenities.stream().anyMatch(facilityIds::contains);
                        if (!hasAny) {
                            return false;
                        }
                    }

                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<Campsite> findByIds(List<String> ids) {
        return ids.stream()
                .map(campsites::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Campsite save(Campsite campsite) {
        campsites.put(campsite.getId(), campsite);
        return campsite;
    }

    public void deleteById(String id) {
        campsites.remove(id);
    }

    public boolean existsById(String id) {
        return campsites.containsKey(id);
    }

    public int count() {
        return campsites.size();
    }
}
