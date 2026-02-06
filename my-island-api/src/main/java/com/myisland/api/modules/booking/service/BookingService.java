package com.myisland.api.modules.booking.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
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
import com.stripe.exception.StripeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final LotRepository lotRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final BookingPaymentService bookingPaymentService;
    private final StripeProperties stripeProperties;

    public BookingService(BookingRepository bookingRepository, LotRepository lotRepository,
            UserRepository userRepository, ApplicationEventPublisher eventPublisher,
            BookingPaymentService bookingPaymentService, StripeProperties stripeProperties) {
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
        this.bookingPaymentService = bookingPaymentService;
        this.stripeProperties = stripeProperties;
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

        // Check owner subscription - owners must have active subscription to receive
        // bookings
        Owner owner = lot.getOwner();
        if (!owner.hasActiveSubscription()) {
            throw new BadRequestException("This property is not currently accepting bookings.");
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

        // Calculate total price (owner's asking price)
        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        BigDecimal totalPrice = lot.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // Calculate service fee (added on top, platform keeps this)
        BigDecimal serviceFee = totalPrice.multiply(BigDecimal.valueOf(stripeProperties.getServiceFeePercent()))
                .setScale(2, RoundingMode.HALF_UP);

        // Calculate charge total (what guest pays)
        BigDecimal chargeTotal = totalPrice.add(serviceFee);

        Booking booking = Booking.builder()
                .user(user)
                .lot(lot)
                .checkInDate(request.checkInDate())
                .checkOutDate(request.checkOutDate())
                .numGuests(request.numGuests())
                .totalPrice(totalPrice)
                .serviceFee(serviceFee)
                .chargeTotal(chargeTotal)
                .specialRequests(request.specialRequests())
                .status(Booking.BookingStatus.PENDING_PAYMENT)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Created booking: {} for user: {} at lot: {} (total: {}, fee: {}, charge: {})",
                booking.getId(), userId, lot.getId(), totalPrice, serviceFee, chargeTotal);

        // Publish event
        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CREATED));

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto confirmBooking(Long bookingId, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // Verify the user is the owner of the lot
        if (!booking.getLot().getOwner().getUser().getId().equals(ownerId)) {
            throw new BadRequestException("You are not authorized to confirm this booking");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be confirmed");
        }

        // Capture payment
        try {
            bookingPaymentService.capturePayment(bookingId);
        } catch (StripeException e) {
            log.error("Failed to capture payment for booking {}: {}", bookingId, e.getMessage());
            throw new BadRequestException("Failed to process payment: " + e.getMessage());
        }

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        log.info("Confirmed booking: {}", bookingId);

        // Create owner payout (async in production, but immediate for simplicity)
        try {
            bookingPaymentService.createOwnerPayout(bookingId);
        } catch (StripeException e) {
            log.error("Failed to create payout for booking {}: {}", bookingId, e.getMessage());
            // Don't fail the confirmation - payout can be retried
        }

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CONFIRMED));

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // Allow cancellation by either the guest who made the booking OR the lot owner
        boolean isGuest = booking.getUser().getId().equals(userId);
        boolean isOwner = booking.getLot().getOwner().getUser().getId().equals(userId);

        if (!isGuest && !isOwner) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        // Handle payment based on current state
        try {
            if (booking.getPaymentStatus() == Booking.PaymentStatus.AUTHORIZED) {
                // Release the authorization hold (no charge)
                bookingPaymentService.releaseAuthorization(bookingId);
            } else if (booking.getPaymentStatus() == Booking.PaymentStatus.CAPTURED) {
                // Refund the captured payment (full refund - guest-friendly policy)
                bookingPaymentService.processRefund(bookingId);
            }
        } catch (StripeException e) {
            log.error("Failed to process payment cancellation for booking {}: {}", bookingId, e.getMessage());
            throw new BadRequestException("Failed to process refund: " + e.getMessage());
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        log.info("Cancelled booking: {} by user: {} (isOwner: {})", bookingId, userId, isOwner);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CANCELLED));

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto simulatePaymentSuccess(Long bookingId, Long userId) {
        if (!stripeProperties.isDevMode()) {
            throw new BadRequestException("This endpoint is only available in dev mode");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Booking is not awaiting payment");
        }

        // Simulate successful payment authorization
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.AUTHORIZED);
        booking = bookingRepository.save(booking);

        log.info("Dev mode: Simulated payment success for booking {}", bookingId);

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
