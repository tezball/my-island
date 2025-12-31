package com.myisland.repository;

import com.myisland.model.CampsiteLot;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class LotRepository {
    private final Map<String, CampsiteLot> lots = new ConcurrentHashMap<>();
    private final AtomicInteger idCounter = new AtomicInteger(1);

    public Optional<CampsiteLot> findById(String id) {
        return Optional.ofNullable(lots.get(id));
    }

    public Collection<CampsiteLot> findAll() {
        return lots.values();
    }

    public CampsiteLot save(CampsiteLot lot) {
        if (lot.getId() == null) {
            lot.setId("lot-" + idCounter.getAndIncrement());
        }
        lots.put(lot.getId(), lot);
        return lot;
    }

    public void deleteById(String id) {
        lots.remove(id);
    }

    public boolean existsById(String id) {
        return lots.containsKey(id);
    }
}
