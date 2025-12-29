package com.myisland.api.repository;

import com.myisland.api.entity.LocalSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface LocalSupplierRepository extends JpaRepository<LocalSupplier, UUID> {
    List<LocalSupplier> findByCampsiteId(UUID campsiteId);
}
