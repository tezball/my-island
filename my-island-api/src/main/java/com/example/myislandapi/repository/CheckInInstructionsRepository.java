package com.example.myislandapi.repository;

import com.example.myislandapi.entity.CheckInInstructions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckInInstructionsRepository extends JpaRepository<CheckInInstructions, UUID> {

    Optional<CheckInInstructions> findByCampsiteId(UUID campsiteId);
}
