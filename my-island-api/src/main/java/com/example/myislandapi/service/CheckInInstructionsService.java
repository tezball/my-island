package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.CheckInInstructionsResponse;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.CheckInInstructions;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.CheckInInstructionsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CheckInInstructionsService {

    private final CheckInInstructionsRepository checkInInstructionsRepository;
    private final BookingRepository bookingRepository;

    public CheckInInstructionsService(CheckInInstructionsRepository checkInInstructionsRepository,
                                     BookingRepository bookingRepository) {
        this.checkInInstructionsRepository = checkInInstructionsRepository;
        this.bookingRepository = bookingRepository;
    }

    public CheckInInstructionsResponse getForBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user has access (is the guest or the owner)
        boolean isGuest = booking.getUser().getId().equals(userId);
        boolean isOwner = booking.getLot().getCampsite().getOwner().getId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new ResourceNotFoundException("Booking not found");
        }

        // Only show check-in instructions for confirmed/checked-in bookings
        if (booking.getStatus() != BookingStatus.CONFIRMED &&
            booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new ResourceNotFoundException("Check-in instructions not available for this booking status");
        }

        UUID campsiteId = booking.getLot().getCampsite().getId();
        CheckInInstructions instructions = checkInInstructionsRepository.findByCampsiteId(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in instructions not found"));

        return toResponse(instructions);
    }

    private CheckInInstructionsResponse toResponse(CheckInInstructions instructions) {
        return new CheckInInstructionsResponse(
                instructions.getId(),
                instructions.getCampsite().getId(),
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
