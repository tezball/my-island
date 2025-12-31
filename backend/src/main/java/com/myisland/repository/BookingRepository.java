package com.myisland.repository;

import com.myisland.model.Booking;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class BookingRepository {
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    private final AtomicInteger referenceCounter = new AtomicInteger(8821);

    public Optional<Booking> findById(String id) {
        return Optional.ofNullable(bookings.get(id));
    }

    public Collection<Booking> findAll() {
        return bookings.values();
    }

    public List<Booking> findByUserId(String userId) {
        return bookings.values().stream()
                .filter(b -> userId.equals(b.getUserId()))
                .collect(Collectors.toList());
    }

    public List<Booking> findByUserIdAndStatus(String userId, String status) {
        LocalDate today = LocalDate.now();
        return bookings.values().stream()
                .filter(b -> userId.equals(b.getUserId()))
                .filter(b -> {
                    if ("upcoming".equals(status)) {
                        return b.getStatus() == Booking.BookingStatus.confirmed &&
                               !b.getCheckIn().isBefore(today);
                    } else if ("past".equals(status)) {
                        return b.getStatus() == Booking.BookingStatus.completed ||
                               (b.getStatus() == Booking.BookingStatus.confirmed &&
                                b.getCheckOut().isBefore(today));
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<LocalDate> findUnavailableDatesForCampsite(String campsiteId) {
        List<LocalDate> unavailableDates = new ArrayList<>();
        bookings.values().stream()
                .filter(b -> campsiteId.equals(b.getCampsiteId()))
                .filter(b -> b.getStatus() == Booking.BookingStatus.confirmed)
                .forEach(b -> {
                    LocalDate date = b.getCheckIn();
                    while (!date.isAfter(b.getCheckOut())) {
                        unavailableDates.add(date);
                        date = date.plusDays(1);
                    }
                });
        return unavailableDates;
    }

    public Booking save(Booking booking) {
        bookings.put(booking.getId(), booking);
        return booking;
    }

    public String generateReference() {
        return "ISL-2025-" + referenceCounter.getAndIncrement();
    }

    public void deleteById(String id) {
        bookings.remove(id);
    }

    public boolean existsById(String id) {
        return bookings.containsKey(id);
    }
}
