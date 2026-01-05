package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Extra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExtraRepository extends JpaRepository<Extra, UUID> {

    List<Extra> findByCampsiteIdAndAvailableTrue(UUID campsiteId);

    List<Extra> findByCampsiteId(UUID campsiteId);

    // Owner-specific queries
    List<Extra> findByCampsiteOwnerIdOrderByCreatedAtDesc(UUID ownerId);

    List<Extra> findByCampsiteIdAndCampsiteOwnerIdOrderByCreatedAtDesc(UUID campsiteId, UUID ownerId);

    Optional<Extra> findByIdAndCampsiteOwnerId(UUID id, UUID ownerId);
}
