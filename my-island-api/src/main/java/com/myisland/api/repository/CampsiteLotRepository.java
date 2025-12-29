package com.myisland.api.repository;

import com.myisland.api.entity.CampsiteLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampsiteLotRepository extends JpaRepository<CampsiteLot, UUID> {
    List<CampsiteLot> findByCampsiteId(UUID campsiteId);
}
