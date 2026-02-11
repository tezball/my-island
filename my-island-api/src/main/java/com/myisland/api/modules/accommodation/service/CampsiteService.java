package com.myisland.api.modules.accommodation.service;

import com.myisland.api.modules.accommodation.controller.CampsiteController.BookedDateRange;
import com.myisland.api.modules.accommodation.dto.LotDto;
import com.myisland.api.modules.accommodation.dto.OwnerDto;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotBlockedPeriodRepository;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class CampsiteService {

    private final OwnerRepository ownerRepository;
    private final LotRepository lotRepository;
    private final BookingRepository bookingRepository;
    private final LotBlockedPeriodRepository blockedPeriodRepository;

    public CampsiteService(OwnerRepository ownerRepository, LotRepository lotRepository,
                           BookingRepository bookingRepository, LotBlockedPeriodRepository blockedPeriodRepository) {
        this.ownerRepository = ownerRepository;
        this.lotRepository = lotRepository;
        this.bookingRepository = bookingRepository;
        this.blockedPeriodRepository = blockedPeriodRepository;
    }

    public List<OwnerDto> getAllCampsites() {
        return ownerRepository.findAll().stream()
                .map(OwnerDto::from)
                .toList();
    }

    public OwnerDto getCampsiteById(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", id));
        return OwnerDto.from(owner);
    }

    public List<OwnerDto> getCampsitesByCounty(String county) {
        return ownerRepository.findByCounty(county).stream()
                .map(OwnerDto::from)
                .toList();
    }

    public List<String> getAllCounties() {
        return ownerRepository.findAllCounties();
    }

    public List<LotDto> getCampsiteLots(Long campsiteId) {
        ownerRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", campsiteId));

        return lotRepository.findByOwnerIdAndIsActiveTrue(campsiteId).stream()
                .map(LotDto::from)
                .toList();
    }

    public List<LotDto> getAvailableLots(Long campsiteId, LocalDate checkIn, LocalDate checkOut) {
        ownerRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", campsiteId));

        return lotRepository.findAvailableLotsByOwner(campsiteId, checkIn, checkOut).stream()
                .map(LotDto::from)
                .toList();
    }

    public LotDto getLotById(Long lotId) {
        return lotRepository.findById(lotId)
                .map(LotDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", lotId));
    }

    public List<OwnerDto> getFeaturedCampsites() {
        return ownerRepository.findFeaturedOwners().stream()
                .map(OwnerDto::from)
                .toList();
    }

    public List<BookedDateRange> getBookedDates(Long lotId) {
        lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", lotId));

        // Get bookings from today onwards that are not cancelled
        List<BookedDateRange> dates = new ArrayList<>(
                bookingRepository.findByLotIdAndCheckOutDateAfter(lotId, LocalDate.now()).stream()
                        .map(booking -> new BookedDateRange(booking.getCheckInDate(), booking.getCheckOutDate()))
                        .toList()
        );

        // Include blocked periods as unavailable dates
        blockedPeriodRepository.findByLotId(lotId).stream()
                .filter(bp -> !bp.getEndDate().isBefore(LocalDate.now()))
                .map(bp -> new BookedDateRange(bp.getStartDate(), bp.getEndDate()))
                .forEach(dates::add);

        return dates;
    }

    /**
     * Returns dates where ALL lots of a given type at a campsite are unavailable.
     * A date is only "unavailable" if every lot of that type has a booking or block covering it.
     */
    public List<BookedDateRange> getUnavailableDatesByType(Long ownerId, Lot.LotType lotType) {
        ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite", ownerId));

        List<Lot> lotsOfType = lotRepository.findByOwnerIdAndIsActiveTrue(ownerId).stream()
                .filter(l -> l.getLotType() == lotType)
                .toList();

        if (lotsOfType.isEmpty()) {
            return List.of();
        }

        int totalLots = lotsOfType.size();

        // Collect all date ranges (bookings + blocked periods) for each lot
        // Then find dates where ALL lots are occupied
        // We expand ranges into individual dates and count occupancy per date
        LocalDate today = LocalDate.now();
        // Look ahead 18 months max for performance
        LocalDate horizon = today.plusMonths(18);

        // For each date, track how many lots are unavailable
        // A date is fully booked only when unavailableCount == totalLots
        Set<LocalDate> fullyBookedDates = new HashSet<>();

        // First pass: find all dates that appear in any booking/block
        Set<LocalDate> candidateDates = new HashSet<>();
        for (Lot lot : lotsOfType) {
            List<Booking> bookings = bookingRepository.findByLotIdAndCheckOutDateAfter(lot.getId(), today);
            for (Booking b : bookings) {
                LocalDate d = b.getCheckInDate().isBefore(today) ? today : b.getCheckInDate();
                LocalDate end = b.getCheckOutDate().isAfter(horizon) ? horizon : b.getCheckOutDate();
                while (d.isBefore(end)) {
                    candidateDates.add(d);
                    d = d.plusDays(1);
                }
            }
            blockedPeriodRepository.findByLotId(lot.getId()).stream()
                    .filter(bp -> !bp.getEndDate().isBefore(today))
                    .forEach(bp -> {
                        LocalDate d = bp.getStartDate().isBefore(today) ? today : bp.getStartDate();
                        LocalDate end = bp.getEndDate().isAfter(horizon) ? horizon : bp.getEndDate();
                        while (d.isBefore(end)) {
                            candidateDates.add(d);
                            d = d.plusDays(1);
                        }
                    });
        }

        // Second pass: for each candidate date, count how many lots are unavailable
        for (LocalDate date : candidateDates) {
            int unavailableCount = 0;
            for (Lot lot : lotsOfType) {
                boolean isBooked = bookingRepository.findOverlappingBookings(
                        lot.getId(), date, date.plusDays(1)).size() > 0;
                boolean isBlocked = blockedPeriodRepository.findOverlappingBlocks(
                        lot.getId(), date, date.plusDays(1)).size() > 0;
                if (isBooked || isBlocked) {
                    unavailableCount++;
                }
            }
            if (unavailableCount >= totalLots) {
                fullyBookedDates.add(date);
            }
        }

        // Convert individual dates into contiguous ranges
        return consolidateDates(fullyBookedDates);
    }

    private List<BookedDateRange> consolidateDates(Set<LocalDate> dates) {
        if (dates.isEmpty()) return List.of();

        List<LocalDate> sorted = dates.stream().sorted().toList();
        List<BookedDateRange> ranges = new ArrayList<>();

        LocalDate rangeStart = sorted.get(0);
        LocalDate rangeEnd = sorted.get(0);

        for (int i = 1; i < sorted.size(); i++) {
            LocalDate current = sorted.get(i);
            if (current.equals(rangeEnd.plusDays(1))) {
                rangeEnd = current;
            } else {
                // checkOut is exclusive (day after last occupied night)
                ranges.add(new BookedDateRange(rangeStart, rangeEnd.plusDays(1)));
                rangeStart = current;
                rangeEnd = current;
            }
        }
        ranges.add(new BookedDateRange(rangeStart, rangeEnd.plusDays(1)));

        return ranges;
    }
}
