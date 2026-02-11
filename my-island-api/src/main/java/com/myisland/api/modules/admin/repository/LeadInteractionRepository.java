package com.myisland.api.modules.admin.repository;

import com.myisland.api.modules.admin.entity.LeadInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadInteractionRepository extends JpaRepository<LeadInteraction, Long> {

    List<LeadInteraction> findByLeadIdOrderByCreatedAtDesc(Long leadId);

    long countByLeadId(Long leadId);
}
