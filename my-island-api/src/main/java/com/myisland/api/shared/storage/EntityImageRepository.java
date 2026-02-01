package com.myisland.api.shared.storage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntityImageRepository extends JpaRepository<EntityImage, Long> {

    List<EntityImage> findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
            EntityImage.EntityType entityType, Long entityId);

    Optional<EntityImage> findByEntityTypeAndEntityIdAndIsPrimaryTrue(
            EntityImage.EntityType entityType, Long entityId);

    Optional<EntityImage> findByS3Key(String s3Key);

    int countByEntityTypeAndEntityId(EntityImage.EntityType entityType, Long entityId);

    @Query("SELECT MAX(e.displayOrder) FROM EntityImage e WHERE e.entityType = :type AND e.entityId = :id")
    Optional<Integer> findMaxDisplayOrder(
            @Param("type") EntityImage.EntityType entityType,
            @Param("id") Long entityId);

    @Modifying
    @Query("UPDATE EntityImage e SET e.isPrimary = false WHERE e.entityType = :type AND e.entityId = :id")
    void clearPrimaryForEntity(
            @Param("type") EntityImage.EntityType entityType,
            @Param("id") Long entityId);

    @Modifying
    @Query("DELETE FROM EntityImage e WHERE e.entityType = :type AND e.entityId = :id")
    void deleteAllByEntity(
            @Param("type") EntityImage.EntityType entityType,
            @Param("id") Long entityId);

    List<EntityImage> findByEntityTypeAndEntityIdIn(
            EntityImage.EntityType entityType, List<Long> entityIds);
}
