package com.myisland.api.modules.booking.service;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.booking.dto.BookingDto;
import com.myisland.api.modules.booking.dto.CreateBookingRequest;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final LotRepository lotRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BookingService(BookingRepository bookingRepository, LotRepository lotRepository,
                          UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCheckInDateDesc(userId).stream()
                .map(BookingDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto createBooking(Long userId, CreateBookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Lot lot = lotRepository.findById(request.lotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot", request.lotId()));

        if (!lot.isActive()) {
            throw new BadRequestException("Lot is not available for booking");
        }

        if (request.checkOutDate().isBefore(request.checkInDate()) ||
                request.checkOutDate().isEqual(request.checkInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        if (request.numGuests() > lot.getMaxGuests()) {
            throw new BadRequestException("Number of guests exceeds lot capacity of " + lot.getMaxGuests());
        }

        // Check for overlapping bookings
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                lot.getId(), request.checkInDate(), request.checkOutDate());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("Lot is not available for the selected dates");
        }

        // Calculate total price
        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        BigDecimal totalPrice = lot.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = Booking.builder()
                .user(user)
                .lot(lot)
                .checkInDate(request.checkInDate())
                .checkOutDate(request.checkOutDate())
                .numGuests(request.numGuests())
                .totalPrice(totalPrice)
                .specialRequests(request.specialRequests())
                .status(Booking.BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Created booking: {} for user: {} at lot: {}", booking.getId(), userId, lot.getId());

        // Publish event
        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CREATED));

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be confirmed");
        }

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        log.info("Confirmed booking: {}", bookingId);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CONFIRMED));

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        log.info("Cancelled booking: {}", bookingId);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CANCELLED));

        return BookingDto.from(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId).stream()
                .map(BookingDto::from)
                .toList();
    }
}
