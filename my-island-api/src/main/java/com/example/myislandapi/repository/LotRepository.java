package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.enums.LotType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LotRepository extends JpaRepository<Lot, UUID> {

    List<Lot> findByCampsiteId(UUID campsiteId);

    List<Lot> findByCampsiteIdAndAvailableTrue(UUID campsiteId);

    List<Lot> findByCampsiteIdAndType(UUID campsiteId, LotType type);

    List<Lot> findByCampsiteIdAndTypeAndAvailableTrueOrderByPricePerNightAsc(UUID campsiteId, LotType type);
}
