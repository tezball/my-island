package com.myisland.api.modules.booking.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.LotBlockedPeriod;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotBlockedPeriodRepository;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.service.PricingService;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.dto.*;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.entity.BookingModificationLog;
import com.myisland.api.modules.booking.entity.BookingModificationRequest;
import com.myisland.api.modules.booking.repository.BookingModificationLogRepository;
import com.myisland.api.modules.booking.repository.BookingModificationRequestRepository;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.identity.service.AccessLevel;
import com.myisland.api.modules.identity.service.PermissionGroup;
import com.myisland.api.modules.identity.service.StaffPermissionChecker;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.modules.admin.service.FeatureToggleService;
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
import java.time.LocalDateTime;
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
    private final LotBlockedPeriodRepository blockedPeriodRepository;
    private final PricingService pricingService;
    private final OwnerRepository ownerRepository;
    private final StaffPermissionChecker permissionChecker;
    private final BookingModificationLogRepository modificationLogRepository;
    private final BookingModificationRequestRepository modificationRequestRepository;
    private final FeatureToggleService featureToggleService;

    public BookingService(BookingRepository bookingRepository, LotRepository lotRepository,
            UserRepository userRepository, ApplicationEventPublisher eventPublisher,
            BookingPaymentService bookingPaymentService, StripeProperties stripeProperties,
            LotBlockedPeriodRepository blockedPeriodRepository, PricingService pricingService,
            OwnerRepository ownerRepository, StaffPermissionChecker permissionChecker,
            BookingModificationLogRepository modificationLogRepository,
            BookingModificationRequestRepository modificationRequestRepository,
            FeatureToggleService featureToggleService) {
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
        this.modificationLogRepository = modificationLogRepository;
        this.modificationRequestRepository = modificationRequestRepository;
        this.featureToggleService = featureToggleService;
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
        if (featureToggleService.isSubscriptionEnforced() && !owner.hasActiveSubscription()) {
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

        // Enforce minimum stay requirement
        int minStay = pricingService.getMinimumStay(lot, request.checkInDate());
        long requestedNights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        if (requestedNights < minStay) {
            throw new BadRequestException("Minimum stay is " + minStay + " nights for this accommodation");
        }

        // Check for overlapping bookings on the requested lot
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                lot.getId(), request.checkInDate(), request.checkOutDate());
        List<LotBlockedPeriod> blockedPeriods = blockedPeriodRepository.findOverlappingBlocks(
                lot.getId(), request.checkInDate(), request.checkOutDate());

        // If the requested lot is taken, auto-assign another available lot of the same type
        if (!overlapping.isEmpty() || !blockedPeriods.isEmpty()) {
            Lot.LotType requestedType = lot.getLotType();
            int requestedGuests = request.numGuests();
            List<Lot> availableLots = lotRepository.findAvailableLotsByOwner(
                    owner.getId(), request.checkInDate(), request.checkOutDate());
            Lot alternate = availableLots.stream()
                    .filter(l -> l.getLotType() == requestedType)
                    .filter(l -> l.getMaxGuests() >= requestedGuests)
                    .findFirst()
                    .orElse(null);

            if (alternate == null) {
                throw new BadRequestException("No " + requestedType.name().toLowerCase().replace('_', ' ')
                        + " lots are available for the selected dates");
            }
            lot = alternate;
        }

        // Calculate total price using seasonal pricing rules (falls back to base price)
        BigDecimal totalPrice = pricingService.calculateTotalPrice(lot, request.checkInDate(), request.checkOutDate());

        // Add power hookup surcharge for tent lots (€5 per night)
        if (Boolean.TRUE.equals(request.wantsPower()) && lot.getLotType() == Lot.LotType.TENT) {
            long nights = java.time.temporal.ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
            BigDecimal powerSurcharge = BigDecimal.valueOf(5).multiply(BigDecimal.valueOf(nights));
            totalPrice = totalPrice.add(powerSurcharge);
        }

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
        if (!isGuest) {
            // Only check owner/staff permission if the caller is not the booking guest
            // (calling checkOwnerPermission inside a try-catch marks the transaction rollback-only)
            permissionChecker.checkOwnerPermission(userId, booking.getLot().getOwner(), PermissionGroup.BOOKINGS, AccessLevel.FULL);
            isOwnerOrStaff = true;
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
    public BookingDto retryPayment(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getUser() == null || !booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        if (booking.getStatus() != Booking.BookingStatus.PAYMENT_FAILED) {
            throw new BadRequestException("Only failed-payment bookings can be retried");
        }

        // Reset to pending_payment so guest can re-attempt
        booking.setStatus(Booking.BookingStatus.PENDING_PAYMENT);
        booking.setPaymentStatus(Booking.PaymentStatus.NONE);
        booking.setStripePaymentIntentId(null); // Clear old intent so a new one is created
        booking = bookingRepository.save(booking);
        log.info("Reset booking {} to PENDING_PAYMENT for payment retry", bookingId);

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

        if (featureToggleService.isSubscriptionEnforced() && !owner.hasActiveSubscription()) {
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

    @Transactional
    public BookingDto modifyBooking(Long bookingId, Long userId, ModifyBookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // Permission check: owner or staff with BOOKINGS FULL access
        permissionChecker.checkOwnerPermission(userId, booking.getLot().getOwner(), PermissionGroup.BOOKINGS, AccessLevel.FULL);

        // Validate status
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED && booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Only confirmed or checked-in bookings can be modified");
        }

        // Block if payment is authorized (pending capture)
        if (booking.getPaymentStatus() == Booking.PaymentStatus.AUTHORIZED) {
            throw new BadRequestException("Cannot modify a booking with an authorized payment hold. Please confirm or cancel the booking first.");
        }

        return applyBookingModification(booking, request.lotId(), request.checkInDate(),
                request.checkOutDate(), null, userId, request.reason(), "OWNER");
    }

    // ==================== Guest Modification Methods ====================

    @Transactional(readOnly = true)
    public GuestModificationPolicyDto getModificationPolicy(Long bookingId, Long guestUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getUser() == null || !booking.getUser().getId().equals(guestUserId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        Owner owner = booking.getLot().getOwner();
        boolean allowed = owner.isAllowGuestModifications();
        int deadlineDays = owner.getModificationDeadlineDays();
        boolean requiresApproval = owner.isRequireModificationApproval();

        // Compute canModify
        boolean canModify = true;
        String cannotModifyReason = null;

        if (!allowed) {
            canModify = false;
            cannotModifyReason = "This property does not allow guest modifications.";
        } else if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            canModify = false;
            cannotModifyReason = "Only confirmed bookings can be modified.";
        } else if (booking.getPaymentStatus() == Booking.PaymentStatus.AUTHORIZED) {
            canModify = false;
            cannotModifyReason = "Cannot modify a booking with a pending payment authorization.";
        } else {
            long daysUntilCheckIn = ChronoUnit.DAYS.between(LocalDate.now(), booking.getCheckInDate());
            if (daysUntilCheckIn < deadlineDays) {
                canModify = false;
                cannotModifyReason = "Modifications must be made at least " + deadlineDays + " days before check-in.";
            } else {
                // Check for existing pending request
                List<BookingModificationRequest> pending = modificationRequestRepository
                        .findByBookingIdAndStatus(bookingId, BookingModificationRequest.Status.PENDING);
                if (!pending.isEmpty()) {
                    canModify = false;
                    cannotModifyReason = "A modification request is already pending for this booking.";
                }
            }
        }

        return new GuestModificationPolicyDto(allowed, deadlineDays, requiresApproval, canModify, cannotModifyReason);
    }

    @Transactional
    public BookingDto guestModifyBooking(Long bookingId, Long guestUserId, GuestModifyBookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // Verify guest owns the booking
        if (booking.getUser() == null || !booking.getUser().getId().equals(guestUserId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        // Verify status
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be modified");
        }

        Owner owner = booking.getLot().getOwner();

        // Check owner allows guest modifications
        if (!owner.isAllowGuestModifications()) {
            throw new BadRequestException("This property does not allow guest modifications.");
        }

        // Check deadline
        long daysUntilCheckIn = ChronoUnit.DAYS.between(LocalDate.now(), booking.getCheckInDate());
        if (daysUntilCheckIn < owner.getModificationDeadlineDays()) {
            throw new BadRequestException("Modifications must be made at least " + owner.getModificationDeadlineDays() + " days before check-in.");
        }

        // Check no pending request exists
        List<BookingModificationRequest> pending = modificationRequestRepository
                .findByBookingIdAndStatus(bookingId, BookingModificationRequest.Status.PENDING);
        if (!pending.isEmpty()) {
            throw new BadRequestException("A modification request is already pending for this booking.");
        }

        // Block if payment is authorized
        if (booking.getPaymentStatus() == Booking.PaymentStatus.AUTHORIZED) {
            throw new BadRequestException("Cannot modify a booking with a pending payment authorization.");
        }

        // Validate at least one change
        boolean hasChange = request.lotId() != null || request.checkInDate() != null
                || request.checkOutDate() != null || request.wantsPower() != null;
        if (!hasChange) {
            throw new BadRequestException("No changes specified");
        }

        // Resolve proposed values
        Lot currentLot = booking.getLot();
        Lot newLot = currentLot;
        if (request.lotId() != null && !request.lotId().equals(currentLot.getId())) {
            newLot = lotRepository.findById(request.lotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lot", request.lotId()));
            if (!newLot.getOwner().getId().equals(currentLot.getOwner().getId())) {
                throw new BadRequestException("New lot must belong to the same property");
            }
            if (!newLot.isActive()) {
                throw new BadRequestException("Selected lot is not active");
            }
        }

        LocalDate newCheckIn = request.checkInDate() != null ? request.checkInDate() : booking.getCheckInDate();
        LocalDate newCheckOut = request.checkOutDate() != null ? request.checkOutDate() : booking.getCheckOutDate();

        if (!newCheckOut.isAfter(newCheckIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // Check guest capacity
        if (booking.getNumGuests() > newLot.getMaxGuests()) {
            throw new BadRequestException("Number of guests (" + booking.getNumGuests() + ") exceeds lot capacity of " + newLot.getMaxGuests());
        }

        // Enforce minimum stay requirement
        int guestMinStay = pricingService.getMinimumStay(newLot, newCheckIn);
        long guestNights = ChronoUnit.DAYS.between(newCheckIn, newCheckOut);
        if (guestNights < guestMinStay) {
            throw new BadRequestException("Minimum stay is " + guestMinStay + " nights for this accommodation");
        }

        // Check availability (excluding this booking)
        List<Booking> overlapping = bookingRepository.findOverlappingBookingsExcluding(
                newLot.getId(), newCheckIn, newCheckOut, bookingId);
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("The selected lot is not available for the new dates");
        }

        List<LotBlockedPeriod> blockedPeriods = blockedPeriodRepository.findOverlappingBlocks(
                newLot.getId(), newCheckIn, newCheckOut);
        if (!blockedPeriods.isEmpty()) {
            throw new BadRequestException("The selected lot is blocked for the new dates");
        }

        // Calculate new price
        BigDecimal newTotalPrice = pricingService.calculateTotalPrice(newLot, newCheckIn, newCheckOut);

        // Add power surcharge if requested for tent lots
        if (Boolean.TRUE.equals(request.wantsPower()) && newLot.getLotType() == Lot.LotType.TENT) {
            long nights = ChronoUnit.DAYS.between(newCheckIn, newCheckOut);
            BigDecimal powerSurcharge = BigDecimal.valueOf(5).multiply(BigDecimal.valueOf(nights));
            newTotalPrice = newTotalPrice.add(powerSurcharge);
        }

        BigDecimal priceDifference = newTotalPrice.subtract(booking.getTotalPrice());

        if (!owner.isRequireModificationApproval()) {
            // Auto-approve: apply modification immediately
            BookingDto result = applyBookingModification(booking, request.lotId(), request.checkInDate(),
                    request.checkOutDate(), request.wantsPower(), guestUserId, request.reason(), "GUEST");

            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.GUEST_MODIFIED));

            return result;
        } else {
            // Create pending request for owner approval
            BookingModificationRequest modRequest = new BookingModificationRequest();
            modRequest.setBooking(booking);
            modRequest.setRequestedByUserId(guestUserId);
            modRequest.setStatus(BookingModificationRequest.Status.PENDING);
            modRequest.setRequestedLotId(request.lotId());
            modRequest.setRequestedCheckInDate(request.checkInDate());
            modRequest.setRequestedCheckOutDate(request.checkOutDate());
            modRequest.setRequestedWantsPower(request.wantsPower());
            modRequest.setEstimatedNewPrice(newTotalPrice);
            modRequest.setPriceDifference(priceDifference);
            modRequest.setReason(request.reason());
            modificationRequestRepository.save(modRequest);

            log.info("Guest {} created modification request {} for booking {}",
                    guestUserId, modRequest.getId(), bookingId);

            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.MODIFICATION_REQUESTED));

            return BookingDto.from(booking);
        }
    }

    @Transactional
    public ModificationRequestDto resolveModificationRequest(Long requestId, Long ownerUserId,
            boolean approve, String declineReason) {
        BookingModificationRequest modRequest = modificationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ModificationRequest", requestId));

        if (modRequest.getStatus() != BookingModificationRequest.Status.PENDING) {
            throw new BadRequestException("This modification request has already been resolved");
        }

        // Permission check
        Booking booking = modRequest.getBooking();
        permissionChecker.checkOwnerPermission(ownerUserId, booking.getLot().getOwner(),
                PermissionGroup.BOOKINGS, AccessLevel.FULL);

        if (approve) {
            // Re-validate availability before applying
            Lot newLot = booking.getLot();
            if (modRequest.getRequestedLotId() != null && !modRequest.getRequestedLotId().equals(newLot.getId())) {
                newLot = lotRepository.findById(modRequest.getRequestedLotId())
                        .orElseThrow(() -> new ResourceNotFoundException("Lot", modRequest.getRequestedLotId()));
            }
            LocalDate newCheckIn = modRequest.getRequestedCheckInDate() != null
                    ? modRequest.getRequestedCheckInDate() : booking.getCheckInDate();
            LocalDate newCheckOut = modRequest.getRequestedCheckOutDate() != null
                    ? modRequest.getRequestedCheckOutDate() : booking.getCheckOutDate();

            List<Booking> overlapping = bookingRepository.findOverlappingBookingsExcluding(
                    newLot.getId(), newCheckIn, newCheckOut, booking.getId());
            if (!overlapping.isEmpty()) {
                throw new BadRequestException("The requested lot is no longer available for those dates");
            }

            // Apply the modification
            applyBookingModification(booking, modRequest.getRequestedLotId(),
                    modRequest.getRequestedCheckInDate(), modRequest.getRequestedCheckOutDate(),
                    modRequest.getRequestedWantsPower(), modRequest.getRequestedByUserId(),
                    modRequest.getReason(), "GUEST");

            modRequest.setStatus(BookingModificationRequest.Status.APPROVED);
            modRequest.setResolvedByUserId(ownerUserId);
            modRequest.setResolvedAt(LocalDateTime.now());
            modificationRequestRepository.save(modRequest);

            log.info("Owner {} approved modification request {} for booking {}", ownerUserId, requestId, booking.getId());

            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.MODIFICATION_APPROVED));
        } else {
            modRequest.setStatus(BookingModificationRequest.Status.DECLINED);
            modRequest.setResolvedByUserId(ownerUserId);
            modRequest.setResolvedAt(LocalDateTime.now());
            modRequest.setDeclineReason(declineReason);
            modificationRequestRepository.save(modRequest);

            log.info("Owner {} declined modification request {} for booking {}", ownerUserId, requestId, booking.getId());

            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.MODIFICATION_DECLINED));
        }

        return ModificationRequestDto.from(modRequest);
    }

    @Transactional(readOnly = true)
    public List<ModificationRequestDto> getOwnerPendingModificationRequests(Long ownerUserId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(ownerUserId, PermissionGroup.BOOKINGS, AccessLevel.READ);
        return modificationRequestRepository.findByOwnerIdAndStatus(owner.getId(), BookingModificationRequest.Status.PENDING)
                .stream()
                .map(ModificationRequestDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ModificationRequestDto> getBookingModificationRequests(Long bookingId, Long guestUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getUser() == null || !booking.getUser().getId().equals(guestUserId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        return modificationRequestRepository.findByBookingIdOrderByCreatedAtDesc(bookingId)
                .stream()
                .map(ModificationRequestDto::from)
                .toList();
    }

    @Transactional
    public void cancelModificationRequest(Long bookingId, Long requestId, Long guestUserId) {
        BookingModificationRequest modRequest = modificationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ModificationRequest", requestId));

        if (!modRequest.getBooking().getId().equals(bookingId)) {
            throw new BadRequestException("Request does not belong to this booking");
        }

        if (!modRequest.getRequestedByUserId().equals(guestUserId)) {
            throw new BadRequestException("You can only cancel your own modification requests");
        }

        if (modRequest.getStatus() != BookingModificationRequest.Status.PENDING) {
            throw new BadRequestException("Only pending requests can be cancelled");
        }

        modRequest.setStatus(BookingModificationRequest.Status.CANCELLED);
        modRequest.setResolvedAt(LocalDateTime.now());
        modificationRequestRepository.save(modRequest);

        log.info("Guest {} cancelled modification request {} for booking {}", guestUserId, requestId, bookingId);
    }

    // ==================== Private Helpers ====================

    private BookingDto applyBookingModification(Booking booking, Long newLotId, LocalDate newCheckInDate,
            LocalDate newCheckOutDate, Boolean wantsPower, Long modifiedByUserId, String reason, String initiatedBy) {

        Lot previousLot = booking.getLot();
        LocalDate previousCheckIn = booking.getCheckInDate();
        LocalDate previousCheckOut = booking.getCheckOutDate();
        BigDecimal previousTotalPrice = booking.getTotalPrice();

        // Resolve new lot
        Lot newLot = previousLot;
        if (newLotId != null && !newLotId.equals(previousLot.getId())) {
            newLot = lotRepository.findById(newLotId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lot", newLotId));
            if (!newLot.getOwner().getId().equals(previousLot.getOwner().getId())) {
                throw new BadRequestException("New lot must belong to the same owner");
            }
            if (!newLot.isActive()) {
                throw new BadRequestException("Selected lot is not active");
            }
        }

        LocalDate newCheckIn = newCheckInDate != null ? newCheckInDate : previousCheckIn;
        LocalDate newCheckOut = newCheckOutDate != null ? newCheckOutDate : previousCheckOut;

        boolean lotChanged = !newLot.getId().equals(previousLot.getId());
        boolean datesChanged = !newCheckIn.equals(previousCheckIn) || !newCheckOut.equals(previousCheckOut);
        boolean powerChanged = wantsPower != null;

        if (!lotChanged && !datesChanged && !powerChanged) {
            throw new BadRequestException("No changes specified");
        }

        if (!newCheckOut.isAfter(newCheckIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // Enforce minimum stay requirement on modifications
        int modMinStay = pricingService.getMinimumStay(newLot, newCheckIn);
        long modNights = ChronoUnit.DAYS.between(newCheckIn, newCheckOut);
        if (modNights < modMinStay) {
            throw new BadRequestException("Minimum stay is " + modMinStay + " nights for this accommodation");
        }

        if (booking.getStatus() == Booking.BookingStatus.CHECKED_IN && newCheckIn.isAfter(LocalDate.now())) {
            throw new BadRequestException("Cannot set a future check-in date on an already checked-in booking");
        }

        if (booking.getNumGuests() > newLot.getMaxGuests()) {
            throw new BadRequestException("Number of guests (" + booking.getNumGuests() + ") exceeds new lot capacity of " + newLot.getMaxGuests());
        }

        // Check availability (excluding this booking)
        List<Booking> overlapping = bookingRepository.findOverlappingBookingsExcluding(
                newLot.getId(), newCheckIn, newCheckOut, booking.getId());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("The selected lot is not available for the new dates");
        }

        List<LotBlockedPeriod> blockedPeriods = blockedPeriodRepository.findOverlappingBlocks(
                newLot.getId(), newCheckIn, newCheckOut);
        if (!blockedPeriods.isEmpty()) {
            throw new BadRequestException("The selected lot is blocked for the new dates");
        }

        // Recalculate price
        BigDecimal newTotalPrice = pricingService.calculateTotalPrice(newLot, newCheckIn, newCheckOut);

        // Add power surcharge if requested
        if (Boolean.TRUE.equals(wantsPower) && newLot.getLotType() == Lot.LotType.TENT) {
            long nights = ChronoUnit.DAYS.between(newCheckIn, newCheckOut);
            BigDecimal powerSurcharge = BigDecimal.valueOf(5).multiply(BigDecimal.valueOf(nights));
            newTotalPrice = newTotalPrice.add(powerSurcharge);
        }

        // Update booking fields
        booking.setLot(newLot);
        booking.setCheckInDate(newCheckIn);
        booking.setCheckOutDate(newCheckOut);
        booking.setTotalPrice(newTotalPrice);

        // For manual bookings (no payment), also recalculate serviceFee/chargeTotal
        if (booking.getPaymentStatus() == Booking.PaymentStatus.NONE) {
            BigDecimal serviceFee = newTotalPrice.multiply(BigDecimal.valueOf(stripeProperties.getServiceFeePercent()))
                    .setScale(2, RoundingMode.HALF_UP);
            booking.setServiceFee(serviceFee);
            booking.setChargeTotal(newTotalPrice.add(serviceFee));
        }

        booking = bookingRepository.save(booking);

        // Determine modification type
        String modificationType;
        if (lotChanged && datesChanged) {
            modificationType = "DATE_AND_LOT_CHANGE";
        } else if (lotChanged) {
            modificationType = "LOT_CHANGE";
        } else if (datesChanged) {
            modificationType = "DATE_CHANGE";
        } else {
            modificationType = "POWER_CHANGE";
        }

        // Create audit log entry
        BookingModificationLog modLog = BookingModificationLog.builder()
                .booking(booking)
                .modifiedByUserId(modifiedByUserId)
                .modificationType(modificationType)
                .previousLotId(previousLot.getId())
                .previousCheckInDate(previousCheckIn)
                .previousCheckOutDate(previousCheckOut)
                .previousTotalPrice(previousTotalPrice)
                .newLotId(newLot.getId())
                .newCheckInDate(newCheckIn)
                .newCheckOutDate(newCheckOut)
                .newTotalPrice(newTotalPrice)
                .priceAdjustment(newTotalPrice.subtract(previousTotalPrice))
                .reason(reason)
                .initiatedBy(initiatedBy)
                .build();
        modificationLogRepository.save(modLog);

        log.info("Modified booking: {} (type: {}, initiatedBy: {}, price: {} -> {}, lot: {} -> {}, dates: {}-{} -> {}-{})",
                booking.getId(), modificationType, initiatedBy, previousTotalPrice, newTotalPrice,
                previousLot.getId(), newLot.getId(), previousCheckIn, previousCheckOut, newCheckIn, newCheckOut);

        // Only publish MODIFIED event for owner-initiated modifications (guest events are published by caller)
        if ("OWNER".equals(initiatedBy)) {
            eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.MODIFIED));
        }

        return BookingDto.from(booking);
    }
}
