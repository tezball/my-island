package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.CheckInInstructionsResponse;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.CheckInInstructionsModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcCheckInInstructionsRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CheckInInstructionsService {

    private final JdbcCheckInInstructionsRepository checkInInstructionsRepository;
    private final JdbcBookingRepository bookingRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcCampsiteRepository campsiteRepository;

    public CheckInInstructionsService(JdbcCheckInInstructionsRepository checkInInstructionsRepository,
                                     JdbcBookingRepository bookingRepository,
                                     JdbcLotRepository lotRepository,
                                     JdbcCampsiteRepository campsiteRepository) {
        this.checkInInstructionsRepository = checkInInstructionsRepository;
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.campsiteRepository = campsiteRepository;
    }

    public CheckInInstructionsResponse getForBooking(UUID bookingId, UUID userId) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Load lot and campsite
        LotModel lot = lotRepository.findById(booking.getLotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found"));
        CampsiteModel campsite = campsiteRepository.findById(lot.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found"));

        // Verify user has access (is the guest or the owner)
        boolean isGuest = booking.getUserId().equals(userId);
        boolean isOwner = campsite.getOwnerId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new ResourceNotFoundException("Booking not found");
        }

        // Only show check-in instructions for confirmed/checked-in bookings
        if (booking.getStatus() != BookingStatus.CONFIRMED &&
            booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new ResourceNotFoundException("Check-in instructions not available for this booking status");
        }

        UUID campsiteId = campsite.getId();
        CheckInInstructionsModel instructions = checkInInstructionsRepository.findByCampsiteId(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in instructions not found"));

        return toResponse(instructions, campsiteId);
    }

    private CheckInInstructionsResponse toResponse(CheckInInstructionsModel instructions, UUID campsiteId) {
        return new CheckInInstructionsResponse(
                instructions.getId(),
                campsiteId,
                instructions.getAccessCode(),
                instructions.getGateCode(),
                instructions.getWifiName(),
                instructions.getWifiPassword(),
                instructions.getCheckInTime(),
                instructions.getCheckOutTime(),
                instructions.getDirections(),
                instructions.getParkingInfo(),
                instructions.getRules(),
                new CheckInInstructionsResponse.HostContact(
                        instructions.getHostName(),
                        instructions.getHostPhone(),
                        instructions.getHostEmail(),
                        instructions.getHostAvatar(),
                        instructions.getHostResponseTime()
                )
        );
    }
}
