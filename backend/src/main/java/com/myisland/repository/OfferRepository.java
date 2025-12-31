package com.myisland.repository;

import com.myisland.model.SupplierOffer;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class OfferRepository {
    private final Map<String, SupplierOffer> offers = new ConcurrentHashMap<>();

    public Optional<SupplierOffer> findById(String id) {
        return Optional.ofNullable(offers.get(id));
    }

    public Collection<SupplierOffer> findAll() {
        return offers.values();
    }

    public List<SupplierOffer> findByCategory(SupplierOffer.OfferCategory category) {
        if (category == null) {
            return new ArrayList<>(offers.values());
        }
        return offers.values().stream()
                .filter(offer -> offer.getCategory() == category)
                .collect(Collectors.toList());
    }

    public SupplierOffer save(SupplierOffer offer) {
        offers.put(offer.getId(), offer);
        return offer;
    }

    public void deleteById(String id) {
        offers.remove(id);
    }

    public int count() {
        return offers.size();
    }
}
