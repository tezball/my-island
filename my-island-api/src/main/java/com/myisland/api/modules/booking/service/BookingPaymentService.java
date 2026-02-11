package com.myisland.api.modules.booking.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.booking.dto.BookingDto;
import com.myisland.api.modules.booking.dto.PaymentIntentResponse;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.entity.Booking.BookingStatus;
import com.myisland.api.modules.booking.entity.Booking.PaymentStatus;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.model.Transfer;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCancelParams;
import com.stripe.param.PaymentIntentCaptureParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.TransferCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;

@Service
public class BookingPaymentService {

    private static final Logger log = LoggerFactory.getLogger(BookingPaymentService.class);

    private final BookingRepository bookingRepository;
    private final StripeProperties stripeProperties;
    private final ApplicationEventPublisher eventPublisher;

    public BookingPaymentService(BookingRepository bookingRepository, StripeProperties stripeProperties,
                                  ApplicationEventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.stripeProperties = stripeProperties;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public PaymentIntentResponse createPaymentIntent(Long bookingId, Long userId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // Verify booking belongs to user
        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        // Verify booking is in correct state
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Booking is not awaiting payment");
        }

        // Check if payment intent already exists
        if (booking.getStripePaymentIntentId() != null) {
            // Return existing payment intent details
            if (stripeProperties.isDevMode()) {
                return new PaymentIntentResponse(
                        "pi_dev_" + bookingId + "_secret",
                        booking.getStripePaymentIntentId(),
                        stripeProperties.getPublishableKey(),
                        booking.getChargeTotal(),
                        true
                );
            }
            PaymentIntent existingIntent = PaymentIntent.retrieve(booking.getStripePaymentIntentId());
            return new PaymentIntentResponse(
                    existingIntent.getClientSecret(),
                    existingIntent.getId(),
                    stripeProperties.getPublishableKey(),
                    booking.getChargeTotal(),
                    false
            );
        }

        User user = booking.getUser();
        BigDecimal chargeTotal = booking.getChargeTotal();

        // Dev mode: return mock payment intent
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Creating mock payment intent for booking {}", bookingId);
            String mockPaymentIntentId = "pi_dev_booking_" + bookingId;
            booking.setStripePaymentIntentId(mockPaymentIntentId);
            bookingRepository.save(booking);

            return new PaymentIntentResponse(
                    mockPaymentIntentId + "_secret",
                    mockPaymentIntentId,
                    stripeProperties.getPublishableKey(),
                    chargeTotal,
                    true
            );
        }

        // Create or get Stripe customer
        String customerId = getOrCreateCustomer(user);

        // Create PaymentIntent with manual capture
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(chargeTotal.multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
                .setCurrency("eur")
                .setCustomer(customerId)
                .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.MANUAL)
                .putMetadata("booking_id", bookingId.toString())
                .putMetadata("user_id", userId.toString())
                .setDescription("Booking #" + bookingId + " - " + booking.getLot().getName())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        log.info("Created payment intent {} for booking {}", paymentIntent.getId(), bookingId);

        // Save payment intent ID
        booking.setStripePaymentIntentId(paymentIntent.getId());
        bookingRepository.save(booking);

        return new PaymentIntentResponse(
                paymentIntent.getClientSecret(),
                paymentIntent.getId(),
                stripeProperties.getPublishableKey(),
                chargeTotal,
                false
        );
    }

    @Transactional
    public void handlePaymentIntentSucceeded(PaymentIntent paymentIntent) {
        var metadata = paymentIntent.getMetadata();
        String bookingIdStr = metadata != null ? metadata.get("booking_id") : null;
        if (bookingIdStr == null) {
            log.debug("Payment intent {} has no booking_id metadata, skipping", paymentIntent.getId());
            return;
        }

        Long bookingId = Long.parseLong(bookingIdStr);
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            log.warn("No booking found for payment intent {}", paymentIntent.getId());
            return;
        }

        Booking booking = bookingOpt.get();
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            log.debug("Booking {} is not in PENDING_PAYMENT status, skipping", bookingId);
            return;
        }

        Owner owner = booking.getLot().getOwner();
        if (owner.isInstantBooking()) {
            // Auto-confirm: capture payment and set CONFIRMED immediately
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPaymentStatus(PaymentStatus.AUTHORIZED);
            bookingRepository.save(booking);

            try {
                capturePayment(bookingId);
            } catch (StripeException e) {
                log.error("Failed to capture payment for instant booking {}: {}", bookingId, e.getMessage());
            }

            try {
                createOwnerPayout(bookingId);
            } catch (StripeException e) {
                log.error("Failed to create payout for instant booking {}: {}", bookingId, e.getMessage());
            }

            eventPublisher.publishEvent(new BookingEvent(this, bookingId, BookingEvent.Type.CONFIRMED));
            log.info("Payment authorized and auto-confirmed for instant booking {}", bookingId);
        } else {
            booking.setStatus(BookingStatus.PENDING);
            booking.setPaymentStatus(PaymentStatus.AUTHORIZED);
            bookingRepository.save(booking);

            log.info("Payment authorized for booking {}, status updated to PENDING", bookingId);
        }
    }

    @Transactional
    public void handlePaymentIntentFailed(PaymentIntent paymentIntent) {
        var failedMetadata = paymentIntent.getMetadata();
        String bookingIdStr = failedMetadata != null ? failedMetadata.get("booking_id") : null;
        if (bookingIdStr == null) {
            return;
        }

        Long bookingId = Long.parseLong(bookingIdStr);
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return;
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(BookingStatus.PAYMENT_FAILED);
        booking.setPaymentStatus(PaymentStatus.FAILED);
        bookingRepository.save(booking);

        log.info("Payment failed for booking {}", bookingId);
    }

    /**
     * Called by the frontend after stripe.confirmCardPayment() returns requires_capture.
     * Verifies the PaymentIntent status with Stripe and updates the booking accordingly.
     * This avoids a race condition where the webhook hasn't arrived yet.
     */
    @Transactional
    public BookingDto confirmAuthorization(Long bookingId, Long userId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Booking does not belong to this user");
        }

        // Already processed (webhook may have arrived first)
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            return BookingDto.from(booking);
        }

        String paymentIntentId = booking.getStripePaymentIntentId();
        if (paymentIntentId == null) {
            throw new BadRequestException("No payment intent found for booking");
        }

        if (stripeProperties.isDevMode()) {
            throw new BadRequestException("Use simulate-success in dev mode");
        }

        // Verify with Stripe that the payment is actually authorized
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        String status = paymentIntent.getStatus();

        if ("requires_capture".equals(status)) {
            // Card authorized — update booking
            Owner owner = booking.getLot().getOwner();
            if (owner.isInstantBooking()) {
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setPaymentStatus(PaymentStatus.AUTHORIZED);
                bookingRepository.save(booking);

                try {
                    capturePayment(bookingId);
                } catch (StripeException e) {
                    log.error("Failed to capture payment for instant booking {}: {}", bookingId, e.getMessage());
                }
                try {
                    createOwnerPayout(bookingId);
                } catch (StripeException e) {
                    log.error("Failed to create payout for instant booking {}: {}", bookingId, e.getMessage());
                }

                eventPublisher.publishEvent(new BookingEvent(this, bookingId, BookingEvent.Type.CONFIRMED));
                log.info("Confirmed authorization and auto-confirmed instant booking {}", bookingId);
            } else {
                booking.setStatus(BookingStatus.PENDING);
                booking.setPaymentStatus(PaymentStatus.AUTHORIZED);
                bookingRepository.save(booking);
                log.info("Confirmed authorization for booking {}, status set to PENDING", bookingId);
            }
        } else if ("succeeded".equals(status)) {
            // Already captured somehow
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPaymentStatus(PaymentStatus.CAPTURED);
            bookingRepository.save(booking);
        } else if ("canceled".equals(status)) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setPaymentStatus(PaymentStatus.RELEASED);
            bookingRepository.save(booking);
        } else {
            log.warn("Unexpected PaymentIntent status '{}' for booking {}", status, bookingId);
            throw new BadRequestException("Payment not yet authorized. Please try again.");
        }

        return BookingDto.from(booking);
    }

    @Transactional
    public void capturePayment(Long bookingId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getPaymentStatus() != PaymentStatus.AUTHORIZED) {
            throw new BadRequestException("Payment is not in AUTHORIZED state");
        }

        String paymentIntentId = booking.getStripePaymentIntentId();
        if (paymentIntentId == null) {
            throw new BadRequestException("No payment intent found for booking");
        }

        // Dev mode: simulate capture
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Capturing payment for booking {}", bookingId);
            booking.setPaymentStatus(PaymentStatus.CAPTURED);
            booking.setPaymentCapturedAt(Instant.now());
            bookingRepository.save(booking);
            return;
        }

        // Capture the payment
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        paymentIntent.capture(PaymentIntentCaptureParams.builder().build());

        booking.setPaymentStatus(PaymentStatus.CAPTURED);
        booking.setPaymentCapturedAt(Instant.now());
        bookingRepository.save(booking);

        log.info("Payment captured for booking {}", bookingId);
    }

    @Transactional
    public void releaseAuthorization(Long bookingId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getPaymentStatus() != PaymentStatus.AUTHORIZED) {
            log.debug("Booking {} payment is not AUTHORIZED, nothing to release", bookingId);
            return;
        }

        String paymentIntentId = booking.getStripePaymentIntentId();
        if (paymentIntentId == null) {
            return;
        }

        // Dev mode: simulate release
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Releasing authorization for booking {}", bookingId);
            booking.setPaymentStatus(PaymentStatus.RELEASED);
            bookingRepository.save(booking);
            return;
        }

        // Cancel the payment intent to release the hold
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        paymentIntent.cancel(PaymentIntentCancelParams.builder().build());

        booking.setPaymentStatus(PaymentStatus.RELEASED);
        bookingRepository.save(booking);

        log.info("Authorization released for booking {}", bookingId);
    }

    @Transactional
    public void processRefund(Long bookingId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getPaymentStatus() != PaymentStatus.CAPTURED) {
            throw new BadRequestException("Payment has not been captured, cannot refund");
        }

        String paymentIntentId = booking.getStripePaymentIntentId();
        if (paymentIntentId == null) {
            throw new BadRequestException("No payment intent found for booking");
        }

        // Full refund (guest-friendly policy)
        BigDecimal refundAmount = booking.getChargeTotal();

        // Dev mode: simulate refund
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Processing refund for booking {}, amount: {}", bookingId, refundAmount);
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
            booking.setRefundAmount(refundAmount);
            bookingRepository.save(booking);
            return;
        }

        // Create refund
        RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .setAmount(refundAmount.multiply(BigDecimal.valueOf(100)).longValue())
                .putMetadata("booking_id", bookingId.toString())
                .build();

        Refund refund = Refund.create(params);
        log.info("Created refund {} for booking {}", refund.getId(), bookingId);

        booking.setPaymentStatus(PaymentStatus.REFUNDED);
        booking.setRefundAmount(refundAmount);
        bookingRepository.save(booking);
    }

    @Transactional
    public void createOwnerPayout(Long bookingId) throws StripeException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getPaymentStatus() != PaymentStatus.CAPTURED) {
            throw new BadRequestException("Payment must be captured before payout");
        }

        if (booking.getStripeTransferId() != null) {
            log.debug("Payout already created for booking {}", bookingId);
            return;
        }

        Owner owner = booking.getLot().getOwner();
        String connectAccountId = owner.getStripeConnectAccountId();

        if (connectAccountId == null || !owner.isPayoutsEnabled()) {
            log.warn("Owner {} does not have payouts enabled, skipping transfer", owner.getId());
            return;
        }

        // Owner receives the totalPrice (their asking price), platform keeps serviceFee
        BigDecimal transferAmount = booking.getTotalPrice();

        // Dev mode: simulate transfer
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Creating payout to owner {} for booking {}, amount: {}",
                    owner.getId(), bookingId, transferAmount);
            booking.setStripeTransferId("tr_dev_" + bookingId);
            bookingRepository.save(booking);
            return;
        }

        // Create transfer to connected account
        TransferCreateParams params = TransferCreateParams.builder()
                .setAmount(transferAmount.multiply(BigDecimal.valueOf(100)).longValue())
                .setCurrency("eur")
                .setDestination(connectAccountId)
                .putMetadata("booking_id", bookingId.toString())
                .setDescription("Payout for booking #" + bookingId)
                .build();

        Transfer transfer = Transfer.create(params);
        log.info("Created transfer {} to owner {} for booking {}", transfer.getId(), owner.getId(), bookingId);

        booking.setStripeTransferId(transfer.getId());
        bookingRepository.save(booking);
    }

    public void handleChargeCaptured(String paymentIntentId) {
        Optional<Booking> bookingOpt = bookingRepository.findByStripePaymentIntentId(paymentIntentId);
        if (bookingOpt.isEmpty()) {
            log.debug("No booking found for payment intent {}", paymentIntentId);
            return;
        }

        Booking booking = bookingOpt.get();
        if (booking.getPaymentStatus() == PaymentStatus.CAPTURED) {
            log.debug("Booking {} already marked as captured", booking.getId());
            return;
        }

        booking.setPaymentStatus(PaymentStatus.CAPTURED);
        booking.setPaymentCapturedAt(Instant.now());
        bookingRepository.save(booking);
        log.info("Confirmed payment captured for booking {}", booking.getId());
    }

    public void handleChargeRefunded(String paymentIntentId, long amountRefunded) {
        Optional<Booking> bookingOpt = bookingRepository.findByStripePaymentIntentId(paymentIntentId);
        if (bookingOpt.isEmpty()) {
            return;
        }

        Booking booking = bookingOpt.get();
        BigDecimal refundAmount = BigDecimal.valueOf(amountRefunded).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        booking.setPaymentStatus(PaymentStatus.REFUNDED);
        booking.setRefundAmount(refundAmount);
        bookingRepository.save(booking);
        log.info("Recorded refund for booking {}, amount: {}", booking.getId(), refundAmount);
    }

    public void handleTransferCreated(String transferId, String bookingIdMetadata) {
        if (bookingIdMetadata == null) {
            return;
        }

        Long bookingId = Long.parseLong(bookingIdMetadata);
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return;
        }

        Booking booking = bookingOpt.get();
        booking.setStripeTransferId(transferId);
        bookingRepository.save(booking);
        log.info("Recorded transfer {} for booking {}", transferId, bookingId);
    }

    private String getOrCreateCustomer(User user) throws StripeException {
        // In a real app, you'd store customer ID on the User entity
        // For now, we create a new customer each time
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(user.getEmail())
                .setName(user.getName())
                .putMetadata("user_id", user.getId().toString())
                .build();

        Customer customer = Customer.create(params);
        return customer.getId();
    }
}
