package com.myisland.api.modules.support.repository;

import com.myisland.api.modules.support.entity.SupportTicket;
import com.myisland.api.modules.support.entity.SupportTicket.TicketCategory;
import com.myisland.api.modules.support.entity.SupportTicket.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    Page<SupportTicket> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT t FROM SupportTicket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:category IS NULL OR t.category = :category)")
    Page<SupportTicket> findFiltered(
            @Param("status") TicketStatus status,
            @Param("category") TicketCategory category,
            Pageable pageable);

    long countByStatus(TicketStatus status);
}
