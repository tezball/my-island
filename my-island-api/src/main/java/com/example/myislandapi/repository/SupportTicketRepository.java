package com.example.myislandapi.repository;

import com.example.myislandapi.entity.SupportTicket;
import com.example.myislandapi.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {

    Page<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<SupportTicket> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, TicketStatus status, Pageable pageable);
}
