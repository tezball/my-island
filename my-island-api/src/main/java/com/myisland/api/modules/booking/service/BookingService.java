package com.myisland.api.modules.booking.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.LotBlockedPeriod;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotBlockedPeriodRepository;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.service.PricingService;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.dto.BookingDto;
import com.myisland.api.modules.booking.dto.CreateBookingRequest;
import com.myisland.api.modules.booking.dto.CreateManualBookingRequest;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.identity.service.AccessLevel;
import com.myisland.api.modules.identity.service.PermissionGroup;
import com.myisland.api.modules.identity.service.StaffPermissionChecker;
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
import java.time.LocalDate;
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
    private final LotBlockedPeriodRepository blockedPeriodRepository;
    private final PricingService pricingService;
    private final OwnerRepository ownerRepository;
    private final StaffPermissionChecker permissionChecker;

    public BookingService(BookingRepository bookingRepository, LotRepository lotRepository,
            UserRepository userRepository, ApplicationEventPublisher eventPublisher,
            BookingPaymentService bookingPaymentService, StripeProperties stripeProperties,
            LotBlockedPeriodRepository blockedPeriodRepository, PricingService pricingService,
            OwnerRepository ownerRepository, StaffPermissionChecker permissionChecker) {
        this.bookingRepository = bookingRepository;
        this.lotRepository = lotRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
        this.bookingPaymentService = bookingPaymentService;
        this.stripeProperties = stripeProperties;
        this.blockedPeriodRepository = blockedPeriodRepository;
        this.pricingService = pricingService;
        this.ownerRepository = ownerRepository;
        this.permissionChecker = permissionChecker;
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

        if (booking.getUser() == null || !booking.getUser().getId().equals(userId)) {
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

        // Check owner subscription - owners must have active subscription to receive bookings
        Owner owner = lot.getOwner();
        if (!owner.hasActiveSubscription()) {
            throw new BadRequestException("This property is not currently accepting bookings.");
        }

        // Toggle 5: Require guest email verification
        if (owner.isRequireGuestVerification() && !user.isEmailVerified()) {
            throw new BadRequestException("Email verification is required to book at this property. Please verify your email address first.");
        }

        // Toggle 4: Reject same-day bookings if disabled
        if (request.checkInDate().isEqual(LocalDate.now()) && !owner.isAllowSameDayBookings()) {
            throw new BadRequestException("This property does not accept same-day bookings. Please select a future date.");
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

        // Check for blocked periods
        List<LotBlockedPeriod> blockedPeriods = blockedPeriodRepository.findOverlappingBlocks(
                lot.getId(), request.checkInDate(), request.checkOutDate());
        if (!blockedPeriods.isEmpty()) {
            throw new BadRequestException("Lot is blocked for the selected dates");
        }

        // Calculate total price using seasonal pricing rules (falls back to base price)
        BigDecimal totalPrice = pricingService.calculateTotalPrice(lot, request.checkInDate(), request.checkOutDate());

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

        // Verify the user has BOOKINGS FULL permission (owner or staff)
        permissionChecker.checkOwnerPermission(ownerId, booking.getLot().getOwner(), PermissionGroup.BOOKINGS, AccessLevel.FULL);

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

        // Allow cancellation by the guest, the owner, or staff with BOOKINGS FULL permission
        boolean isGuest = booking.getUser() != null && booking.getUser().getId().equals(userId);
        boolean isOwnerOrStaff = false;
        try {
            permissionChecker.checkOwnerPermission(userId, booking.getLot().getOwner(), PermissionGroup.BOOKINGS, AccessLevel.FULL);
            isOwnerOrStaff = true;
        } catch (Exception ignored) {
            // Not owner/staff — that's ok if they're the guest
        }

        if (!isGuest && !isOwnerOrStaff) {
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
        log.info("Cancelled booking: {} by user: {} (isOwnerOrStaff: {})", bookingId, userId, isOwnerOrStaff);

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

        if (booking.getUser() == null || !booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Booking is not awaiting payment");
        }

        Owner owner = booking.getLot().getOwner();
        if (owner.isInstantBooking()) {
            // Auto-confirm for instant booking owners
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setPaymentStatus(Booking.PaymentStatus.CAPTURED);
            booking = bookingRepository.save(booking);
            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CONFIRMED));
            log.info("Dev mode: Simulated payment success and auto-confirmed booking {}", bookingId);
        } else {
            booking.setStatus(Booking.BookingStatus.PENDING);
            booking.setPaymentStatus(Booking.PaymentStatus.AUTHORIZED);
            booking = bookingRepository.save(booking);
            log.info("Dev mode: Simulated payment success for booking {}", bookingId);
        }

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto checkInBooking(Long bookingId, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        permissionChecker.checkOwnerPermission(ownerId, booking.getLot().getOwner(), PermissionGroup.BOOKINGS, AccessLevel.FULL);

        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be checked in");
        }

        booking.setStatus(Booking.BookingStatus.CHECKED_IN);
        booking = bookingRepository.save(booking);
        log.info("Checked in booking: {}", bookingId);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CHECKED_IN));

        return BookingDto.from(booking);
    }

    @Transactional
    public BookingDto checkOutBooking(Long bookingId, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        permissionChecker.checkOwnerPermission(ownerId, booking.getLot().getOwner(), PermissionGroup.BOOKINGS, AccessLevel.FULL);

        if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Only checked-in bookings can be checked out");
        }

        booking.setStatus(Booking.BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        log.info("Checked out booking: {}", bookingId);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CHECKED_OUT));

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

    @Transactional
    public BookingDto createManualBooking(Long userId, CreateManualBookingRequest request) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.BOOKINGS, AccessLevel.FULL);

        if (!owner.hasActiveSubscription()) {
            throw new BadRequestException("An active subscription is required to create manual bookings.");
        }

        Lot lot = lotRepository.findById(request.lotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot", request.lotId()));

        // Verify lot belongs to this owner
        if (!lot.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Lot does not belong to this owner");
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

        // Check for blocked periods
        List<LotBlockedPeriod> blockedPeriods = blockedPeriodRepository.findOverlappingBlocks(
                lot.getId(), request.checkInDate(), request.checkOutDate());
        if (!blockedPeriods.isEmpty()) {
            throw new BadRequestException("Lot is blocked for the selected dates");
        }

        // Calculate total price using seasonal pricing
        BigDecimal totalPrice = pricingService.calculateTotalPrice(lot, request.checkInDate(), request.checkOutDate());

        // Determine booking source
        Booking.BookingSource source = Booking.BookingSource.DIRECT;
        if (request.bookingSource() != null) {
            try {
                source = Booking.BookingSource.valueOf(request.bookingSource());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid booking source: " + request.bookingSource());
            }
        }

        // Optionally look up existing user by email
        User user = null;
        if (request.guestEmail() != null && !request.guestEmail().isBlank()) {
            user = userRepository.findByEmail(request.guestEmail()).orElse(null);
        }

        Booking booking = Booking.builder()
                .user(user)
                .lot(lot)
                .checkInDate(request.checkInDate())
                .checkOutDate(request.checkOutDate())
                .numGuests(request.numGuests())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.CONFIRMED)
                .specialRequests(request.specialRequests())
                .guestName(request.guestName())
                .guestEmail(request.guestEmail())
                .guestPhone(request.guestPhone())
                .bookingSource(source)
                .createdByOwner(owner)
                .build();

        // No payment for manual bookings
        booking.setPaymentStatus(Booking.PaymentStatus.NONE);

        booking = bookingRepository.save(booking);
        log.info("Created manual booking: {} by owner: {} for guest: {} at lot: {} (total: {})",
                booking.getId(), owner.getId(), request.guestName(), lot.getId(), totalPrice);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.CREATED));

        return BookingDto.from(booking);
    }
}
