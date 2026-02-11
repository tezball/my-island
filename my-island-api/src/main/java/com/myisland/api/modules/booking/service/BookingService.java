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
import com.myisland.api.modules.booking.dto.ModifyBookingRequest;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.entity.BookingModificationLog;
import com.myisland.api.modules.booking.repository.BookingModificationLogRepository;
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
    private final BookingModificationLogRepository modificationLogRepository;

    public BookingService(BookingRepository bookingRepository, LotRepository lotRepository,
            UserRepository userRepository, ApplicationEventPublisher eventPublisher,
            BookingPaymentService bookingPaymentService, StripeProperties stripeProperties,
            LotBlockedPeriodRepository blockedPeriodRepository, PricingService pricingService,
            OwnerRepository ownerRepository, StaffPermissionChecker permissionChecker,
            BookingModificationLogRepository modificationLogRepository) {
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

        // Capture "before" state
        Lot previousLot = booking.getLot();
        LocalDate previousCheckIn = booking.getCheckInDate();
        LocalDate previousCheckOut = booking.getCheckOutDate();
        BigDecimal previousTotalPrice = booking.getTotalPrice();

        // Resolve new values (null = keep current)
        Lot newLot = previousLot;
        if (request.lotId() != null && !request.lotId().equals(previousLot.getId())) {
            newLot = lotRepository.findById(request.lotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lot", request.lotId()));
            // Verify lot belongs to same owner
            if (!newLot.getOwner().getId().equals(previousLot.getOwner().getId())) {
                throw new BadRequestException("New lot must belong to the same owner");
            }
            if (!newLot.isActive()) {
                throw new BadRequestException("Selected lot is not active");
            }
        }

        LocalDate newCheckIn = request.checkInDate() != null ? request.checkInDate() : previousCheckIn;
        LocalDate newCheckOut = request.checkOutDate() != null ? request.checkOutDate() : previousCheckOut;

        // Validate at least one field is changing
        boolean lotChanged = !newLot.getId().equals(previousLot.getId());
        boolean datesChanged = !newCheckIn.equals(previousCheckIn) || !newCheckOut.equals(previousCheckOut);
        if (!lotChanged && !datesChanged) {
            throw new BadRequestException("No changes specified");
        }

        // Validate dates
        if (!newCheckOut.isAfter(newCheckIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // For CHECKED_IN bookings: new check-in must be <= today
        if (booking.getStatus() == Booking.BookingStatus.CHECKED_IN && newCheckIn.isAfter(LocalDate.now())) {
            throw new BadRequestException("Cannot set a future check-in date on an already checked-in booking");
        }

        // Check guest capacity
        if (booking.getNumGuests() > newLot.getMaxGuests()) {
            throw new BadRequestException("Number of guests (" + booking.getNumGuests() + ") exceeds new lot capacity of " + newLot.getMaxGuests());
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

        // Recalculate price
        BigDecimal newTotalPrice = pricingService.calculateTotalPrice(newLot, newCheckIn, newCheckOut);

        // Update booking fields
        booking.setLot(newLot);
        booking.setCheckInDate(newCheckIn);
        booking.setCheckOutDate(newCheckOut);
        booking.setTotalPrice(newTotalPrice);

        // For manual bookings (no payment), also recalculate serviceFee/chargeTotal
        if (booking.getPaymentStatus() == Booking.PaymentStatus.NONE) {
            BigDecimal serviceFee = newTotalPrice.multiply(BigDecimal.valueOf(stripeProperties.getServiceFeePercent()))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
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
        } else {
            modificationType = "DATE_CHANGE";
        }

        // Create audit log entry
        BookingModificationLog modLog = BookingModificationLog.builder()
                .booking(booking)
                .modifiedByUserId(userId)
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
                .reason(request.reason())
                .build();
        modificationLogRepository.save(modLog);

        log.info("Modified booking: {} (type: {}, price: {} -> {}, lot: {} -> {}, dates: {}-{} -> {}-{})",
                bookingId, modificationType, previousTotalPrice, newTotalPrice,
                previousLot.getId(), newLot.getId(), previousCheckIn, previousCheckOut, newCheckIn, newCheckOut);

        eventPublisher.publishEvent(new BookingEvent(this, booking.getId(), BookingEvent.Type.MODIFIED));

        return BookingDto.from(booking);
    }
}
