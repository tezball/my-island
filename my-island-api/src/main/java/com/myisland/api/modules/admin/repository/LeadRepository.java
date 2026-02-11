package com.myisland.api.modules.admin.repository;

import com.myisland.api.modules.admin.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    Page<Lead> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
            SELECT l FROM Lead l
            WHERE (:status IS NULL OR l.status = :status)
            AND (:businessType IS NULL OR l.businessType = :businessType)
            AND (:assignedTo IS NULL OR l.assignedTo = :assignedTo)
            ORDER BY l.createdAt DESC
            """)
    Page<Lead> findFiltered(Lead.LeadStatus status, Lead.BusinessType businessType, Long assignedTo, Pageable pageable);

    @Query("SELECT l FROM Lead l WHERE l.scheduledFollowUp IS NOT NULL AND l.scheduledFollowUp < :now AND l.status NOT IN ('CONVERTED', 'LOST') ORDER BY l.scheduledFollowUp ASC")
    List<Lead> findOverdue(LocalDateTime now);

    long countByStatus(Lead.LeadStatus status);

    long countByBusinessType(Lead.BusinessType businessType);
}
