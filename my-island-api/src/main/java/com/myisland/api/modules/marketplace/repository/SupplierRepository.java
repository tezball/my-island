package com.myisland.api.modules.marketplace.repository;

import com.myisland.api.modules.marketplace.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findByUserId(Long userId);

    List<Supplier> findByCategory(Supplier.SupplierCategory category);

    List<Supplier> findByCounty(String county);

    List<Supplier> findByIsVerifiedTrue();

    Optional<Supplier> findByStripeCustomerId(String stripeCustomerId);
}
