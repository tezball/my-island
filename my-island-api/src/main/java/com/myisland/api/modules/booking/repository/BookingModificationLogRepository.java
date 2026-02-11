package com.myisland.api.modules.booking.repository;

import com.myisland.api.modules.booking.entity.BookingModificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingModificationLogRepository extends JpaRepository<BookingModificationLog, Long> {

    List<BookingModificationLog> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
}
