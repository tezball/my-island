package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.AvailabilityResponse;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.LotAvailabilityModel;
import com.example.myislandapi.enums.AvailabilityStatus;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotAvailabilityRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
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

    private final JdbcLotRepository lotRepository;
    private final JdbcLotAvailabilityRepository availabilityRepository;
    private final JdbcBookingRepository bookingRepository;

    public AvailabilityService(JdbcLotRepository lotRepository,
                               JdbcLotAvailabilityRepository availabilityRepository,
                               JdbcBookingRepository bookingRepository) {
        this.lotRepository = lotRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingRepository = bookingRepository;
    }

    public AvailabilityResponse getAvailability(UUID lotId, LocalDate startDate, LocalDate endDate) {
        LotModel lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found: " + lotId));

        List<LotAvailabilityModel> existingAvailability = availabilityRepository
                .findByLotIdAndDateBetween(lotId, startDate, endDate);

        Map<LocalDate, LotAvailabilityModel> availabilityMap = existingAvailability.stream()
                .collect(Collectors.toMap(LotAvailabilityModel::getDate, Function.identity()));

        List<AvailabilityResponse.DateAvailability> dates = new ArrayList<>();
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            LotAvailabilityModel availability = availabilityMap.get(current);
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
        List<BookingModel> conflicts = bookingRepository.findConflictingBookings(lotId, checkIn, checkOut);
        if (!conflicts.isEmpty()) {
            return false;
        }

        // Check for blocked/maintenance dates
        List<LotAvailabilityModel> unavailable = availabilityRepository.findUnavailableDates(
                lotId, checkIn, checkOut.minusDays(1), AvailabilityStatus.AVAILABLE);

        return unavailable.isEmpty();
    }

    @Transactional
    public void blockDates(UUID lotId, LocalDate checkIn, LocalDate checkOut, UUID bookingId) {
        if (!lotRepository.existsById(lotId)) {
            throw new ResourceNotFoundException("Lot not found: " + lotId);
        }

        LocalDate current = checkIn;
        while (current.isBefore(checkOut)) {
            final LocalDate date = current;
            LotAvailabilityModel availability = availabilityRepository
                    .findByLotIdAndDate(lotId, date)
                    .orElseGet(() -> {
                        LotAvailabilityModel la = new LotAvailabilityModel();
                        la.setLotId(lotId);
                        la.setDate(date);
                        return la;
                    });

            availability.setStatus(AvailabilityStatus.BOOKED);
            availability.setBookingId(bookingId);
            availabilityRepository.save(availability);

            current = current.plusDays(1);
        }
    }

    @Transactional
    public void releaseDates(UUID bookingId) {
        List<LotAvailabilityModel> blockedDates = availabilityRepository.findByBookingId(bookingId);
        for (LotAvailabilityModel availability : blockedDates) {
            availability.setStatus(AvailabilityStatus.AVAILABLE);
            availability.setBookingId(null);
            availabilityRepository.save(availability);
        }
    }
}
