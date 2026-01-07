package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateBookingRequest;
import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.BookingExtra;
import com.example.myislandapi.entity.Extra;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.enums.NotificationType;
import com.example.myislandapi.event.BookingEvent;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.event.NotificationEvent;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.ExtraRepository;
import com.example.myislandapi.repository.LotRepository;
import com.example.myislandapi.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BookingService {

    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.10"); // 10% service fee

    private final BookingRepository bookingRepository;
    private final LotRepository lotRepository;
    private final ExtraRepository extraRepository;
    private final UserRepository userRepository;
    private final AvailabilityService availabilityService;
    private final EventPublisher eventPublisher;

    public BookingService(BookingRepository bookingRepository,
                         LotRepository lotRepository,
                         ExtraRepository extraRepository,
                         UserRepository userRepository,
                         AvailabilityService availabilityService,
                         EventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.extraRepository = extraRepository;
        this.userRepository = userRepository;
        this.availabilityService = availabilityService;
        this.eventPublisher = eventPublisher;
    }

    public BookingResponse createBooking(UUID userId, CreateBookingRequest request) {
        // Validate dates
        if (!request.checkOut().isAfter(request.checkIn())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // Get lot
        Lot lot = lotRepository.findById(request.lotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found: " + request.lotId()));

        // Check capacity
        if (request.guests() > lot.getCapacity()) {
            throw new BadRequestException("Number of guests exceeds lot capacity of " + lot.getCapacity());
        }

        // Check availability
        if (!availabilityService.isAvailable(request.lotId(), request.checkIn(), request.checkOut())) {
            throw new BadRequestException("Lot is not available for the selected dates");
        }

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Calculate prices
        long nights = ChronoUnit.DAYS.between(request.checkIn(), request.checkOut());
        BigDecimal lotPrice = lot.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setLot(lot);
        booking.setCheckIn(request.checkIn());
        booking.setCheckOut(request.checkOut());
        booking.setGuests(request.guests());
        booking.setStatus(BookingStatus.PENDING);
        booking.setLotPrice(lotPrice);
        booking.setSpecialRequests(request.specialRequests());

        // Add extras
        BigDecimal extrasPrice = BigDecimal.ZERO;
        if (request.extras() != null && !request.extras().isEmpty()) {
            for (CreateBookingRequest.BookingExtraRequest extraRequest : request.extras()) {
                Extra extra = extraRepository.findById(extraRequest.extraId())
                        .orElseThrow(() -> new ResourceNotFoundException("Extra not found: " + extraRequest.extraId()));

                BookingExtra bookingExtra = new BookingExtra(booking, extra, extraRequest.quantity());
                booking.addExtra(bookingExtra);
                extrasPrice = extrasPrice.add(bookingExtra.getTotalPrice());
            }
        }
        booking.setExtrasPrice(extrasPrice);

        // Calculate service fee
        BigDecimal subtotal = lotPrice.add(extrasPrice);
        BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        booking.setServiceFee(serviceFee);

        // Calculate total
        BigDecimal totalPrice = subtotal.add(serviceFee);
        booking.setTotalPrice(totalPrice);

        // Save booking
        booking = bookingRepository.save(booking);

        // Block availability
        availabilityService.blockDates(lot.getId(), request.checkIn(), request.checkOut(), booking.getId());

        // Publish events
        publishBookingCreatedEvents(booking);

        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Check ownership
        if (!booking.getUser().getId().equals(userId) &&
            !booking.getLot().getCampsite().getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }

        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getUserBookings(UUID userId, BookingStatus status, Pageable pageable) {
        Page<Booking> bookings;
        if (status != null) {
            bookings = bookingRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            bookings = bookingRepository.findByUserId(userId, pageable);
        }
        return bookings.map(this::toBookingResponse);
    }

    public BookingResponse confirmBooking(UUID bookingId, UUID ownerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!booking.getLot().getCampsite().getOwner().getId().equals(ownerId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking cannot be confirmed in current state");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        // Publish confirmation events
        publishBookingConfirmedEvents(booking);

        return toBookingResponse(booking);
    }

    public BookingResponse cancelBooking(UUID bookingId, UUID userId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        boolean isOwner = booking.getLot().getCampsite().getOwner().getId().equals(userId);
        boolean isGuest = booking.getUser().getId().equals(userId);

        if (!isOwner && !isGuest) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED ||
            booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Booking cannot be cancelled in current state");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking = bookingRepository.save(booking);

        // Release availability
        availabilityService.releaseDates(bookingId);

        // Publish cancellation events
        publishBookingCancelledEvents(booking);

        return toBookingResponse(booking);
    }

    private void publishBookingCreatedEvents(Booking booking) {
        var lot = booking.getLot();
        var campsite = lot.getCampsite();

        // Booking event
        eventPublisher.publishBookingEvent(BookingEvent.created(
                booking.getId(),
                booking.getUser().getId(),
                campsite.getId(),
                lot.getId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice()
        ));

        // Notification to owner
        eventPublisher.publishNotificationEvent(NotificationEvent.create(
                campsite.getOwner().getId(),
                NotificationType.BOOKING,
                "New Booking Request",
                "You have a new booking request for " + campsite.getName(),
                booking.getId()
        ));
    }

    private void publishBookingConfirmedEvents(Booking booking) {
        var lot = booking.getLot();
        var campsite = lot.getCampsite();

        // Booking event
        eventPublisher.publishBookingEvent(BookingEvent.confirmed(
                booking.getId(),
                booking.getUser().getId(),
                campsite.getId(),
                lot.getId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice()
        ));

        // Notification to guest
        eventPublisher.publishNotificationEvent(NotificationEvent.create(
                booking.getUser().getId(),
                NotificationType.BOOKING,
                "Booking Confirmed",
                "Your booking at " + campsite.getName() + " has been confirmed!",
                booking.getId()
        ));

        // Email to guest
        eventPublisher.publishEmailEvent(EmailEvent.bookingConfirmation(
                booking.getUser().getId(),
                booking.getId()
        ));
    }

    private void publishBookingCancelledEvents(Booking booking) {
        var lot = booking.getLot();
        var campsite = lot.getCampsite();

        // Booking event
        eventPublisher.publishBookingEvent(BookingEvent.cancelled(
                booking.getId(),
                booking.getUser().getId(),
                campsite.getId(),
                lot.getId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice()
        ));

        // Notification to guest
        eventPublisher.publishNotificationEvent(NotificationEvent.create(
                booking.getUser().getId(),
                NotificationType.BOOKING,
                "Booking Cancelled",
                "Your booking at " + campsite.getName() + " has been cancelled.",
                booking.getId()
        ));

        // Email to guest
        eventPublisher.publishEmailEvent(EmailEvent.bookingCancellation(
                booking.getUser().getId(),
                booking.getId()
        ));
    }

    private BookingResponse toBookingResponse(Booking booking) {
        Lot lot = booking.getLot();
        var campsite = lot.getCampsite();
        var user = booking.getUser();

        var lotSummary = new BookingResponse.LotSummary(
                lot.getId(),
                lot.getName(),
                lot.getType().name(),
                lot.getImages()
        );

        var campsiteSummary = new BookingResponse.CampsiteSummary(
                campsite.getId(),
                campsite.getName(),
                campsite.getLocation() != null ? campsite.getLocation().getCounty() : null,
                campsite.getImages().isEmpty() ? null : campsite.getImages().get(0)
        );

        var guestSummary = new BookingResponse.GuestSummary(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatar()
        );

        List<BookingResponse.BookingExtraResponse> extras = booking.getBookingExtras().stream()
                .map(be -> new BookingResponse.BookingExtraResponse(
                        be.getExtra().getId(),
                        be.getExtra().getName(),
                        be.getQuantity(),
                        be.getUnitPrice(),
                        be.getTotalPrice()
                ))
                .toList();

        return new BookingResponse(
                booking.getId(),
                booking.getStatus(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getGuests(),
                booking.getNights(),
                booking.getLotPrice(),
                booking.getExtrasPrice(),
                booking.getServiceFee(),
                booking.getTotalPrice(),
                booking.getSpecialRequests(),
                lotSummary,
                campsiteSummary,
                guestSummary,
                extras,
                booking.getCreatedAt()
        );
    }
}
