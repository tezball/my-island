package com.myisland.api.modules.accommodation.repository;

import com.myisland.api.modules.accommodation.entity.SavedLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedLotRepository extends JpaRepository<SavedLot, Long> {

    List<SavedLot> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndLotId(Long userId, Long lotId);

    void deleteByUserIdAndLotId(Long userId, Long lotId);

    long countByUserId(Long userId);
}
