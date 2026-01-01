package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Supplier;
import com.example.myislandapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    Optional<Supplier> findByUser(User user);

    Optional<Supplier> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
