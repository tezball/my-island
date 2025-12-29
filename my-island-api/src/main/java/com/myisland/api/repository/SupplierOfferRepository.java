package com.myisland.api.repository;

import com.myisland.api.entity.SupplierOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SupplierOfferRepository extends JpaRepository<SupplierOffer, UUID> {
    List<SupplierOffer> findByCategory(SupplierOffer.OfferCategory category);
}
