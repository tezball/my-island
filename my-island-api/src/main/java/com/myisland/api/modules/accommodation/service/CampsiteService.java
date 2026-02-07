package com.myisland.api.modules.accommodation.service;

import com.myisland.api.modules.accommodation.controller.CampsiteController.BookedDateRange;
import com.myisland.api.modules.accommodation.dto.LotDto;
import com.myisland.api.modules.accommodation.dto.OwnerDto;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotBlockedPeriodRepository;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
}
