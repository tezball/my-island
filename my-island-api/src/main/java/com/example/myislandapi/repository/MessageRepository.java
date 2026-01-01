package com.example.myislandapi.repository;

import com.example.myislandapi.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    Page<Message> findByBookingIdOrderByCreatedAtDesc(UUID bookingId, Pageable pageable);

    List<Message> findByBookingIdOrderByCreatedAtAsc(UUID bookingId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.booking.id = :bookingId " +
           "AND m.sender.id != :userId AND m.read = false")
    int countUnreadForBooking(@Param("bookingId") UUID bookingId, @Param("userId") UUID userId);
}
