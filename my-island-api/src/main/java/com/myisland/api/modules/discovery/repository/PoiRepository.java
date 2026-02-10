package com.myisland.api.modules.discovery.repository;

import com.myisland.api.modules.discovery.entity.PointOfInterest;
import com.myisland.api.modules.discovery.entity.PointOfInterest.PoiCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoiRepository extends JpaRepository<PointOfInterest, Long> {

    List<PointOfInterest> findByCategory(PoiCategory category);

    List<PointOfInterest> findByCounty(String county);
}
