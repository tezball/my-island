package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateBookingRequest;
import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.enums.NotificationType;
import com.example.myislandapi.event.BookingEvent;
import com.example.myislandapi.event.EmailEvent;
import com.example.myislandapi.event.NotificationEvent;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.BookingExtraModel;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.ExtraModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcExtraRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BookingService {

    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.10"); // 10% service fee

    private final JdbcBookingRepository bookingRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcExtraRepository extraRepository;
    private final JdbcUserRepository userRepository;
    private final JdbcCampsiteRepository campsiteRepository;
    private final AvailabilityService availabilityService;
    private final EventPublisher eventPublisher;

    public BookingService(JdbcBookingRepository bookingRepository,
                         JdbcLotRepository lotRepository,
                         JdbcExtraRepository extraRepository,
                         JdbcUserRepository userRepository,
                         JdbcCampsiteRepository campsiteRepository,
                         AvailabilityService availabilityService,
                         EventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.extraRepository = extraRepository;
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
        this.availabilityService = availabilityService;
        this.eventPublisher = eventPublisher;
    }

    public BookingResponse createBooking(UUID userId, CreateBookingRequest request) {
        // Validate dates
        if (!request.checkOut().isAfter(request.checkIn())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // Get lot
        LotModel lot = lotRepository.findById(request.lotId())
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
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Get campsite for the lot
        CampsiteModel campsite = campsiteRepository.findById(lot.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + lot.getCampsiteId()));

        // Calculate prices
        long nights = ChronoUnit.DAYS.between(request.checkIn(), request.checkOut());
        BigDecimal lotPrice = lot.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // Create booking
        BookingModel booking = new BookingModel();
        booking.setUserId(userId);
        booking.setLotId(lot.getId());
        booking.setCheckIn(request.checkIn());
        booking.setCheckOut(request.checkOut());
        booking.setGuests(request.guests());
        booking.setStatus(BookingStatus.PENDING);
        booking.setLotPrice(lotPrice);
        booking.setSpecialRequests(request.specialRequests());

        // Add extras
        BigDecimal extrasPrice = BigDecimal.ZERO;
        List<BookingExtraModel> bookingExtras = new ArrayList<>();
        if (request.extras() != null && !request.extras().isEmpty()) {
            for (CreateBookingRequest.BookingExtraRequest extraRequest : request.extras()) {
                ExtraModel extra = extraRepository.findById(extraRequest.extraId())
                        .orElseThrow(() -> new ResourceNotFoundException("Extra not found: " + extraRequest.extraId()));

                BookingExtraModel bookingExtra = new BookingExtraModel();
                bookingExtra.setExtraId(extra.getId());
                bookingExtra.setQuantity(extraRequest.quantity());
                bookingExtra.setUnitPrice(extra.getPrice());
                bookingExtra.calculateTotalPrice(nights, extra.isPerNight());
                bookingExtra.setExtra(extra);
                bookingExtras.add(bookingExtra);
                extrasPrice = extrasPrice.add(bookingExtra.getTotalPrice());
            }
        }
        booking.setBookingExtras(bookingExtras);
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

        // Set transient fields for response
        booking.setUser(user);
        booking.setLot(lot);
        lot.setCampsite(campsite);

        // Publish events
        publishBookingCreatedEvents(booking, campsite);

        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(UUID bookingId, UUID userId) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Load related entities
        loadBookingRelations(booking);

        // Check ownership
        if (!booking.getUserId().equals(userId) &&
            !booking.getLot().getCampsite().getOwnerId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }

        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getUserBookings(UUID userId, BookingStatus status, Pageable pageable) {
        Page<BookingModel> bookings;
        if (status != null) {
            bookings = bookingRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            bookings = bookingRepository.findByUserId(userId, pageable);
        }
        return bookings.map(booking -> {
            loadBookingRelations(booking);
            return toBookingResponse(booking);
        });
    }

    public BookingResponse confirmBooking(UUID bookingId, UUID ownerId) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Load related entities
        loadBookingRelations(booking);

        if (!booking.getLot().getCampsite().getOwnerId().equals(ownerId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking cannot be confirmed in current state");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        // Reload relations after save
        loadBookingRelations(booking);

        // Publish confirmation events
        publishBookingConfirmedEvents(booking);

        return toBookingResponse(booking);
    }

    public BookingResponse cancelBooking(UUID bookingId, UUID userId, String reason) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Load related entities
        loadBookingRelations(booking);

        boolean isOwner = booking.getLot().getCampsite().getOwnerId().equals(userId);
        boolean isGuest = booking.getUserId().equals(userId);

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

        // Reload relations after save
        loadBookingRelations(booking);

        // Publish cancellation events
        publishBookingCancelledEvents(booking);

        return toBookingResponse(booking);
    }

    private void loadBookingRelations(BookingModel booking) {
        // Load user
        if (booking.getUser() == null) {
            userRepository.findById(booking.getUserId()).ifPresent(booking::setUser);
        }

        // Load lot
        if (booking.getLot() == null) {
            lotRepository.findById(booking.getLotId()).ifPresent(lot -> {
                booking.setLot(lot);
                // Load campsite for the lot
                campsiteRepository.findById(lot.getCampsiteId()).ifPresent(lot::setCampsite);
            });
        } else if (booking.getLot().getCampsite() == null) {
            campsiteRepository.findById(booking.getLot().getCampsiteId())
                    .ifPresent(booking.getLot()::setCampsite);
        }

        // Load extras
        if (booking.getBookingExtras() != null) {
            for (BookingExtraModel bookingExtra : booking.getBookingExtras()) {
                if (bookingExtra.getExtra() == null) {
                    extraRepository.findById(bookingExtra.getExtraId())
                            .ifPresent(bookingExtra::setExtra);
                }
            }
        }
    }

    private void publishBookingCreatedEvents(BookingModel booking, CampsiteModel campsite) {
        // Booking event
        eventPublisher.publishBookingEvent(BookingEvent.created(
                booking.getId(),
                booking.getUserId(),
                campsite.getId(),
                booking.getLotId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice()
        ));

        // Notification to owner
        eventPublisher.publishNotificationEvent(NotificationEvent.create(
                campsite.getOwnerId(),
                NotificationType.BOOKING,
                "New Booking Request",
                "You have a new booking request for " + campsite.getName(),
                booking.getId()
        ));
    }

    private void publishBookingConfirmedEvents(BookingModel booking) {
        LotModel lot = booking.getLot();
        CampsiteModel campsite = lot.getCampsite();

        // Booking event
        eventPublisher.publishBookingEvent(BookingEvent.confirmed(
                booking.getId(),
                booking.getUserId(),
                campsite.getId(),
                lot.getId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice()
        ));

        // Notification to guest
        eventPublisher.publishNotificationEvent(NotificationEvent.create(
                booking.getUserId(),
                NotificationType.BOOKING,
                "Booking Confirmed",
                "Your booking at " + campsite.getName() + " has been confirmed!",
                booking.getId()
        ));

        // Email to guest
        eventPublisher.publishEmailEvent(EmailEvent.bookingConfirmation(
                booking.getUserId(),
                booking.getId()
        ));
    }

    private void publishBookingCancelledEvents(BookingModel booking) {
        LotModel lot = booking.getLot();
        CampsiteModel campsite = lot.getCampsite();

        // Booking event
        eventPublisher.publishBookingEvent(BookingEvent.cancelled(
                booking.getId(),
                booking.getUserId(),
                campsite.getId(),
                lot.getId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice()
        ));

        // Notification to guest
        eventPublisher.publishNotificationEvent(NotificationEvent.create(
                booking.getUserId(),
                NotificationType.BOOKING,
                "Booking Cancelled",
                "Your booking at " + campsite.getName() + " has been cancelled.",
                booking.getId()
        ));

        // Email to guest
        eventPublisher.publishEmailEvent(EmailEvent.bookingCancellation(
                booking.getUserId(),
                booking.getId()
        ));
    }

    private BookingResponse toBookingResponse(BookingModel booking) {
        LotModel lot = booking.getLot();
        CampsiteModel campsite = lot.getCampsite();
        UserModel user = booking.getUser();

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
                        be.getExtraId(),
                        be.getExtra() != null ? be.getExtra().getName() : "Unknown",
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
