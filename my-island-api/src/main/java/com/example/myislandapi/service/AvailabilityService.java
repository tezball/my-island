package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.AvailabilityResponse;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.LotAvailability;
import com.example.myislandapi.enums.AvailabilityStatus;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.LotAvailabilityRepository;
import com.example.myislandapi.repository.LotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AvailabilityService {

    private final LotRepository lotRepository;
    private final LotAvailabilityRepository availabilityRepository;
    private final BookingRepository bookingRepository;

    public AvailabilityService(LotRepository lotRepository,
                               LotAvailabilityRepository availabilityRepository,
                               BookingRepository bookingRepository) {
        this.lotRepository = lotRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingRepository = bookingRepository;
    }

    public AvailabilityResponse getAvailability(UUID lotId, LocalDate startDate, LocalDate endDate) {
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found: " + lotId));

        List<LotAvailability> existingAvailability = availabilityRepository
                .findByLotIdAndDateBetween(lotId, startDate, endDate);

        Map<LocalDate, LotAvailability> availabilityMap = existingAvailability.stream()
                .collect(Collectors.toMap(LotAvailability::getDate, Function.identity()));

        List<AvailabilityResponse.DateAvailability> dates = new ArrayList<>();
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            LotAvailability availability = availabilityMap.get(current);
            AvailabilityStatus status = availability != null ? availability.getStatus() : AvailabilityStatus.AVAILABLE;
            BigDecimal price = availability != null && availability.getPriceOverride() != null
                    ? availability.getPriceOverride()
                    : lot.getPricePerNight();

            dates.add(new AvailabilityResponse.DateAvailability(current, status, price));
            current = current.plusDays(1);
        }

        return new AvailabilityResponse(dates);
    }

    public boolean isAvailable(UUID lotId, LocalDate checkIn, LocalDate checkOut) {
        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(lotId, checkIn, checkOut);
        if (!conflicts.isEmpty()) {
            return false;
        }

        // Check for blocked/maintenance dates
        List<LotAvailability> unavailable = availabilityRepository.findUnavailableDates(
                lotId, checkIn, checkOut.minusDays(1), AvailabilityStatus.AVAILABLE);

        return unavailable.isEmpty();
    }

    @Transactional
    public void blockDates(UUID lotId, LocalDate checkIn, LocalDate checkOut, Booking booking) {
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found: " + lotId));

        LocalDate current = checkIn;
        while (current.isBefore(checkOut)) {
            final LocalDate date = current;
            LotAvailability availability = availabilityRepository
                    .findByLotIdAndDate(lotId, date)
                    .orElseGet(() -> new LotAvailability(lot, date));

            availability.setStatus(AvailabilityStatus.BOOKED);
            availability.setBooking(booking);
            availabilityRepository.save(availability);

            current = current.plusDays(1);
        }
    }

    @Transactional
    public void releaseDates(UUID bookingId) {
        List<LotAvailability> blockedDates = availabilityRepository.findByBookingId(bookingId);
        for (LotAvailability availability : blockedDates) {
            availability.setStatus(AvailabilityStatus.AVAILABLE);
            availability.setBooking(null);
        }
        availabilityRepository.saveAll(blockedDates);
    }
}
