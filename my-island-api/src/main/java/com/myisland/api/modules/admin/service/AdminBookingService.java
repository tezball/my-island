package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.entity.Booking.BookingStatus;
import com.myisland.api.modules.booking.repository.BookingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminBookingService {

    private final BookingRepository bookingRepository;
    private final AdminAuditService adminAuditService;

    public AdminBookingService(BookingRepository bookingRepository, AdminAuditService adminAuditService) {
        this.bookingRepository = bookingRepository;
        this.adminAuditService = adminAuditService;
    }

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> listBookings(String status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (status == null || status.isBlank()) {
            Page<Booking> bookings = bookingRepository.findAll(pageRequest);
            return bookings.map(this::toDto);
        } else {
            BookingStatus bookingStatus = BookingStatus.valueOf(status);
            List<Booking> allBookings = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Booking> filteredBookings = allBookings.stream()
                    .filter(b -> b.getStatus() == bookingStatus)
                    .collect(Collectors.toList());

            int start = page * size;
            int end = Math.min(start + size, filteredBookings.size());
            List<Map<String, Object>> pageContent = filteredBookings.subList(start, end).stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());

            return new PageImpl<>(pageContent, pageRequest, filteredBookings.size());
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getBooking(Long id) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return toDto(booking);
    }

    @Transactional
    public Map<String, Object> cancelBooking(Long adminUserId, Long bookingId, String reason) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        BookingStatus previousStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CANCELLED);

        Booking saved = bookingRepository.save(booking);

        adminAuditService.log(
                adminUserId,
                "CANCEL_BOOKING",
                "BOOKING",
                bookingId,
                "Cancelled booking: " + bookingId + ". Reason: " + reason,
                "status=" + previousStatus,
                "status=" + BookingStatus.CANCELLED
        );

        return toDto(saved);
    }

    @Transactional
    public Map<String, Object> updateBooking(Long adminUserId, Long bookingId, String status) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        BookingStatus previousStatus = booking.getStatus();
        BookingStatus newStatus = BookingStatus.valueOf(status);
        booking.setStatus(newStatus);

        Booking saved = bookingRepository.save(booking);

        adminAuditService.log(
                adminUserId,
                "UPDATE_BOOKING",
                "BOOKING",
                bookingId,
                "Updated booking status: " + bookingId,
                "status=" + previousStatus,
                "status=" + newStatus
        );

        return toDto(saved);
    }

    private Map<String, Object> toDto(Booking booking) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", booking.getId());

        // User (guest) info
        if (booking.getUser() != null) {
            dto.put("userId", booking.getUser().getId());
            dto.put("userName", booking.getUser().getName());
            dto.put("userEmail", booking.getUser().getEmail());
        } else {
            dto.put("userId", null);
            dto.put("userName", booking.getGuestName());
            dto.put("userEmail", booking.getGuestEmail());
        }

        // Lot and owner info
        if (booking.getLot() != null) {
            dto.put("lotId", booking.getLot().getId());
            dto.put("lotName", booking.getLot().getName());
            if (booking.getLot().getOwner() != null) {
                dto.put("ownerId", booking.getLot().getOwner().getId());
                dto.put("ownerName", booking.getLot().getOwner().getPropertyName());
            }
        }

        dto.put("checkInDate", booking.getCheckInDate() != null ? booking.getCheckInDate().toString() : null);
        dto.put("checkOutDate", booking.getCheckOutDate() != null ? booking.getCheckOutDate().toString() : null);
        dto.put("numGuests", booking.getNumGuests());
        dto.put("totalPrice", booking.getTotalPrice());
        dto.put("serviceFee", booking.getServiceFee());
        dto.put("chargeTotal", booking.getChargeTotal());
        dto.put("status", booking.getStatus() != null ? booking.getStatus().name() : null);
        dto.put("paymentStatus", booking.getPaymentStatus() != null ? booking.getPaymentStatus().name() : null);
        dto.put("bookingSource", booking.getBookingSource() != null ? booking.getBookingSource().name() : null);
        dto.put("specialRequests", booking.getSpecialRequests());
        dto.put("guestName", booking.getGuestName());
        dto.put("guestEmail", booking.getGuestEmail());
        dto.put("createdAt", booking.getCreatedAt() != null ? booking.getCreatedAt().toString() : null);

        return dto;
    }
}
