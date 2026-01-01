package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    Page<Favorite> findByUserId(UUID userId, Pageable pageable);

    Optional<Favorite> findByUserIdAndCampsiteId(UUID userId, UUID campsiteId);

    boolean existsByUserIdAndCampsiteId(UUID userId, UUID campsiteId);

    void deleteByUserIdAndCampsiteId(UUID userId, UUID campsiteId);
}
