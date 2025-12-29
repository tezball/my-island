package com.myisland.api.service;

import com.myisland.api.dto.request.CreateBookingRequest;
import com.myisland.api.dto.request.UpdateBookingRequest;
import com.myisland.api.dto.response.BookingResponse;
import com.myisland.api.entity.*;
import com.myisland.api.exception.ResourceNotFoundException;
import com.myisland.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CampsiteRepository campsiteRepository;
    private final CampsiteLotRepository lotRepository;
    private final ExtraRepository extraRepository;

    public List<BookingResponse> getUserBookings(UUID userId, String status) {
        List<Booking> bookings;

        if ("upcoming".equals(status)) {
            bookings = bookingRepository.findUpcomingByUserId(userId);
        } else if ("past".equals(status)) {
            bookings = bookingRepository.findPastByUserId(userId);
        } else {
            bookings = bookingRepository.findByUserId(userId);
        }

        return bookings.stream()
            .map(BookingResponse::from)
            .toList();
    }

    public BookingResponse getBooking(UUID id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id.toString()));

        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse createBooking(User user, CreateBookingRequest request) {
        UUID campsiteId = UUID.fromString(request.getCampsiteId());
        UUID lotId = UUID.fromString(request.getLotId());

        Campsite campsite = campsiteRepository.findById(campsiteId)
            .orElseThrow(() -> new ResourceNotFoundException("Campsite", request.getCampsiteId()));

        CampsiteLot lot = lotRepository.findById(lotId)
            .orElseThrow(() -> new ResourceNotFoundException("Lot", request.getLotId()));

        LocalDate checkIn = LocalDate.parse(request.getCheckIn());
        LocalDate checkOut = LocalDate.parse(request.getCheckOut());
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

        Set<Extra> extras = new HashSet<>();
        BigDecimal extrasTotal = BigDecimal.ZERO;

        if (request.getExtras() != null) {
            for (String extraId : request.getExtras()) {
                Extra extra = extraRepository.findById(extraId).orElse(null);
                if (extra != null) {
                    extras.add(extra);
                    extrasTotal = extrasTotal.add(extra.getPrice());
                }
            }
        }

        BigDecimal totalPrice = lot.getPricePerNight()
            .multiply(BigDecimal.valueOf(nights))
            .add(extrasTotal);

        String reference = generateReference();

        Booking booking = Booking.builder()
            .reference(reference)
            .user(user)
            .campsite(campsite)
            .lot(lot)
            .checkIn(checkIn)
            .checkOut(checkOut)
            .adults(request.getAdults())
            .children(request.getChildren() != null ? request.getChildren() : 0)
            .extras(extras)
            .status(Booking.BookingStatus.CONFIRMED)
            .totalPrice(totalPrice)
            .build();

        booking = bookingRepository.save(booking);

        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse updateBooking(UUID id, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id.toString()));

        if (request.getCheckIn() != null) {
            booking.setCheckIn(LocalDate.parse(request.getCheckIn()));
        }
        if (request.getCheckOut() != null) {
            booking.setCheckOut(LocalDate.parse(request.getCheckOut()));
        }
        if (request.getAdults() != null) {
            booking.setAdults(request.getAdults());
        }
        if (request.getChildren() != null) {
            booking.setChildren(request.getChildren());
        }
        if (request.getExtras() != null) {
            Set<Extra> extras = new HashSet<>();
            for (String extraId : request.getExtras()) {
                extraRepository.findById(extraId).ifPresent(extras::add);
            }
            booking.setExtras(extras);
        }

        // Recalculate total
        long nights = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
        BigDecimal extrasTotal = booking.getExtras().stream()
            .map(Extra::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        booking.setTotalPrice(
            booking.getLot().getPricePerNight()
                .multiply(BigDecimal.valueOf(nights))
                .add(extrasTotal)
        );

        booking = bookingRepository.save(booking);

        return BookingResponse.from(booking);
    }

    @Transactional
    public void cancelBooking(UUID id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id.toString()));

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private String generateReference() {
        String prefix = "ISL-" + Year.now().getValue() + "-";
        Integer maxNum = bookingRepository.findMaxReferenceNumber(prefix);
        int nextNum = (maxNum != null ? maxNum : 0) + 1;
        return prefix + String.format("%04d", nextNum);
    }
}
