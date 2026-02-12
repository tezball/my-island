package com.myisland.api.modules.booking.repository;

import com.myisland.api.modules.booking.entity.BookingModificationRequest;
import com.myisland.api.modules.booking.entity.BookingModificationRequest.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingModificationRequestRepository extends JpaRepository<BookingModificationRequest, Long> {

    List<BookingModificationRequest> findByBookingIdAndStatus(Long bookingId, Status status);

    List<BookingModificationRequest> findByBookingIdOrderByCreatedAtDesc(Long bookingId);

    @Query("SELECT r FROM BookingModificationRequest r JOIN r.booking b JOIN b.lot l " +
           "WHERE l.owner.id = :ownerId AND r.status = :status ORDER BY r.createdAt DESC")
    List<BookingModificationRequest> findByOwnerIdAndStatus(Long ownerId, Status status);
}
