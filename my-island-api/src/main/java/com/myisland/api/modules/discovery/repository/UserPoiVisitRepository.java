package com.myisland.api.modules.discovery.repository;

import com.myisland.api.modules.discovery.entity.UserPoiVisit;
import com.myisland.api.modules.discovery.entity.UserPoiVisit.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPoiVisitRepository extends JpaRepository<UserPoiVisit, Long> {

    List<UserPoiVisit> findByUserId(Long userId);

    Optional<UserPoiVisit> findByUserIdAndPoiId(Long userId, Long poiId);

    long countByUserIdAndStatus(Long userId, VisitStatus status);

    void deleteByUserIdAndPoiId(Long userId, Long poiId);
}
