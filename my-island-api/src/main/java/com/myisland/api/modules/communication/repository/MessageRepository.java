package com.myisland.api.modules.communication.repository;

import com.myisland.api.modules.communication.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByBookingIdOrderByCreatedAtAsc(Long bookingId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.booking.id = :bookingId AND m.sender.id <> :userId AND m.isRead = false")
    long countUnreadByBookingIdAndNotSender(Long bookingId, Long userId);

    @Query("SELECT m FROM Message m WHERE m.booking.id = :bookingId AND m.sender.id <> :userId AND m.isRead = false")
    List<Message> findUnreadByBookingIdAndNotSender(Long bookingId, Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.booking.id = :bookingId AND m.sender.id <> :userId AND m.isRead = false")
    void markReadByBookingIdAndNotSender(Long bookingId, Long userId);

    @Query("""
            SELECT DISTINCT m.booking.id FROM Message m
            WHERE m.booking.id IN :bookingIds
            AND m.sender.id <> :userId
            AND m.isRead = false
            """)
    List<Long> findBookingIdsWithUnreadMessages(List<Long> bookingIds, Long userId);

    @Query("""
            SELECT m.booking.id, COUNT(m) FROM Message m
            WHERE m.booking.id IN :bookingIds
            AND m.sender.id <> :userId
            AND m.isRead = false
            GROUP BY m.booking.id
            """)
    List<Object[]> countUnreadByBookingIds(List<Long> bookingIds, Long userId);
}
