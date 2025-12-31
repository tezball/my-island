package com.myisland.service;

import com.myisland.dto.CreateBookingRequest;
import com.myisland.dto.UpdateBookingRequest;
import com.myisland.model.*;
import com.myisland.repository.BookingRepository;
import com.myisland.repository.CampsiteRepository;
import com.myisland.repository.ExtraRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CampsiteRepository campsiteRepository;
    private final ExtraRepository extraRepository;

    public BookingService(BookingRepository bookingRepository, CampsiteRepository campsiteRepository,
                         ExtraRepository extraRepository) {
        this.bookingRepository = bookingRepository;
        this.campsiteRepository = campsiteRepository;
        this.extraRepository = extraRepository;
    }

    public List<Booking> getBookingsForUser(String userId, String status) {
        if (status != null && !status.isEmpty()) {
            return bookingRepository.findByUserIdAndStatus(userId, status);
        }
        return bookingRepository.findByUserId(userId);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Optional<Booking> createBooking(CreateBookingRequest request, String userId) {
        Optional<Campsite> campsiteOpt = campsiteRepository.findById(request.getCampsiteId());
        if (campsiteOpt.isEmpty()) {
            return Optional.empty();
        }

        Campsite campsite = campsiteOpt.get();
        CampsiteLot lot = campsite.getLots().stream()
                .filter(l -> l.getId().equals(request.getLotId()))
                .findFirst()
                .orElse(null);

        if (lot == null) {
            return Optional.empty();
        }

        List<Extra> extras = request.getExtras() != null ?
                extraRepository.findByIds(request.getExtras()) : List.of();

        int nights = (int) ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        double extrasTotal = extras.stream().mapToDouble(Extra::getPrice).sum();
        double totalPrice = (lot.getPricePerNight() * nights) + extrasTotal;

        Booking booking = Booking.builder()
                .id(UUID.randomUUID().toString())
                .reference(bookingRepository.generateReference())
                .campsiteId(campsite.getId())
                .campsite(campsite)
                .lotId(lot.getId())
                .lot(lot)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .nights(nights)
                .guests(request.getGuests())
                .extras(extras)
                .status(Booking.BookingStatus.confirmed)
                .totalPrice(totalPrice)
                .createdAt(LocalDateTime.now())
                .userId(userId)
                .build();

        return Optional.of(bookingRepository.save(booking));
    }

    public Optional<Booking> updateBooking(String id, UpdateBookingRequest request) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();

        if (request.getCheckIn() != null) {
            booking.setCheckIn(request.getCheckIn());
        }
        if (request.getCheckOut() != null) {
            booking.setCheckOut(request.getCheckOut());
        }
        if (request.getGuests() != null) {
            booking.setGuests(request.getGuests());
        }
        if (request.getExtras() != null) {
            List<Extra> extras = extraRepository.findByIds(request.getExtras());
            booking.setExtras(extras);
        }

        int nights = (int) ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
        double extrasTotal = booking.getExtras().stream().mapToDouble(Extra::getPrice).sum();
        double totalPrice = (booking.getLot().getPricePerNight() * nights) + extrasTotal;

        booking.setNights(nights);
        booking.setTotalPrice(totalPrice);

        return Optional.of(bookingRepository.save(booking));
    }

    public boolean cancelBooking(String id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return false;
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(Booking.BookingStatus.cancelled);
        bookingRepository.save(booking);
        return true;
    }

    public List<LocalDate> getUnavailableDates(String campsiteId) {
        return bookingRepository.findUnavailableDatesForCampsite(campsiteId);
    }
}
