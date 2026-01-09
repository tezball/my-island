package com.example.myislandapi.service;

import com.example.myislandapi.config.StripeConfig;
import com.example.myislandapi.dto.response.PaymentIntentResponse;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.event.PaymentEvent;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final String CURRENCY = "eur";

    private final JdbcBookingRepository bookingRepository;
    private final StripeConfig stripeConfig;
    private final EventPublisher eventPublisher;

    public PaymentService(JdbcBookingRepository bookingRepository, StripeConfig stripeConfig,
                          EventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.stripeConfig = stripeConfig;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public PaymentIntentResponse createPaymentIntent(UUID bookingId, UUID userId) throws StripeException {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Verify ownership
        if (!booking.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }

        // Verify booking is in pending status
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Payment can only be made for pending bookings");
        }

        // Convert total price to cents (Stripe uses smallest currency unit)
        long amountInCents = booking.getTotalPrice().multiply(new java.math.BigDecimal("100")).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(CURRENCY)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .putMetadata("booking_id", bookingId.toString())
                .putMetadata("user_id", userId.toString())
                .setDescription("Booking payment for My Island - Booking #" + bookingId)
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        log.info("Created payment intent {} for booking {}", paymentIntent.getId(), bookingId);

        return new PaymentIntentResponse(
                paymentIntent.getClientSecret(),
                paymentIntent.getId(),
                booking.getTotalPrice(),
                CURRENCY,
                bookingId,
                stripeConfig.getPublishableKey()
        );
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeConfig.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe webhook signature", e);
            throw new BadRequestException("Invalid webhook signature");
        }

        log.info("Received Stripe webhook event: {}", event.getType());

        switch (event.getType()) {
            case "payment_intent.succeeded" -> handlePaymentSucceeded(event);
            case "payment_intent.payment_failed" -> handlePaymentFailed(event);
            default -> log.debug("Unhandled event type: {}", event.getType());
        }
    }

    private void handlePaymentSucceeded(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new BadRequestException("Failed to deserialize payment intent"));

        String bookingIdStr = paymentIntent.getMetadata().get("booking_id");
        if (bookingIdStr == null) {
            log.warn("No booking_id in payment intent metadata: {}", paymentIntent.getId());
            return;
        }

        UUID bookingId = UUID.fromString(bookingIdStr);
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            if (booking.getStatus() == BookingStatus.PENDING) {
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setPaymentIntentId(paymentIntent.getId());
                bookingRepository.save(booking);
                log.info("Booking {} confirmed after successful payment", bookingId);

                // Publish payment succeeded event
                eventPublisher.publishPaymentEvent(PaymentEvent.succeeded(
                        bookingId,
                        booking.getUserId(),
                        booking.getTotalPrice(),
                        CURRENCY,
                        paymentIntent.getId()
                ));
            }
        });
    }

    private void handlePaymentFailed(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new BadRequestException("Failed to deserialize payment intent"));

        String bookingIdStr = paymentIntent.getMetadata().get("booking_id");
        if (bookingIdStr == null) {
            log.warn("No booking_id in payment intent metadata: {}", paymentIntent.getId());
            return;
        }

        UUID bookingId = UUID.fromString(bookingIdStr);
        log.warn("Payment failed for booking {}: {}", bookingId, paymentIntent.getLastPaymentError());

        // Publish payment failed event
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            String failureReason = paymentIntent.getLastPaymentError() != null
                    ? paymentIntent.getLastPaymentError().getMessage()
                    : "Unknown error";
            eventPublisher.publishPaymentEvent(PaymentEvent.failed(
                    bookingId,
                    booking.getUserId(),
                    booking.getTotalPrice(),
                    CURRENCY,
                    paymentIntent.getId(),
                    failureReason
            ));
        });
    }
}
