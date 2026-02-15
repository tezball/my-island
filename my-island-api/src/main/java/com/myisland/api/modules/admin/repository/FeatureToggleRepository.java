package com.myisland.api.modules.admin.repository;

import com.myisland.api.modules.admin.entity.FeatureToggle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureToggleRepository extends JpaRepository<FeatureToggle, Long> {

    Optional<FeatureToggle> findByName(String name);
}
