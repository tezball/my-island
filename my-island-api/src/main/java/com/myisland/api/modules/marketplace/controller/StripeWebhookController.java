package com.myisland.api.modules.marketplace.controller;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.service.FeaturedPromotionService;
import com.myisland.api.modules.accommodation.service.OwnerSubscriptionService;
import com.myisland.api.modules.booking.service.BookingPaymentService;
import com.myisland.api.modules.marketplace.service.StripeConnectService;
import com.myisland.api.modules.marketplace.service.SubscriptionService;
import com.myisland.api.modules.marketplace.service.SupplierFeaturedPromotionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Account;
import com.stripe.model.Charge;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Subscription;
import com.stripe.model.Transfer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import io.swagger.v3.oas.annotations.Hidden;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks/stripe")
@Hidden
public class StripeWebhookController {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookController.class);

    private final SubscriptionService supplierSubscriptionService;
    private final OwnerSubscriptionService ownerSubscriptionService;
    private final FeaturedPromotionService ownerFeaturedPromotionService;
    private final SupplierFeaturedPromotionService supplierFeaturedPromotionService;
    private final StripeConnectService stripeConnectService;
    private final BookingPaymentService bookingPaymentService;
    private final StripeProperties stripeProperties;

    public StripeWebhookController(
            SubscriptionService supplierSubscriptionService,
            OwnerSubscriptionService ownerSubscriptionService,
            FeaturedPromotionService ownerFeaturedPromotionService,
            SupplierFeaturedPromotionService supplierFeaturedPromotionService,
            StripeConnectService stripeConnectService,
            BookingPaymentService bookingPaymentService,
            StripeProperties stripeProperties) {
        this.supplierSubscriptionService = supplierSubscriptionService;
        this.ownerSubscriptionService = ownerSubscriptionService;
        this.ownerFeaturedPromotionService = ownerFeaturedPromotionService;
        this.supplierFeaturedPromotionService = supplierFeaturedPromotionService;
        this.stripeConnectService = stripeConnectService;
        this.bookingPaymentService = bookingPaymentService;
        this.stripeProperties = stripeProperties;
    }

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeProperties.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.warn("Invalid Stripe webhook signature");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        log.debug("Received Stripe webhook: {}", event.getType());

        try {
            switch (event.getType()) {
                case "customer.subscription.created" -> {
                    Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Try both - one will match based on customer ID
                    supplierSubscriptionService.handleSubscriptionCreated(subscription);
                    ownerSubscriptionService.handleSubscriptionCreated(subscription);
                }
                case "customer.subscription.updated" -> {
                    Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    supplierSubscriptionService.handleSubscriptionUpdated(subscription);
                    ownerSubscriptionService.handleSubscriptionUpdated(subscription);
                }
                case "customer.subscription.deleted" -> {
                    Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    supplierSubscriptionService.handleSubscriptionDeleted(subscription);
                    ownerSubscriptionService.handleSubscriptionDeleted(subscription);
                }
                case "checkout.session.completed" -> {
                    Session session = (Session) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Handle featured promotion purchases for both owners and suppliers
                    ownerFeaturedPromotionService.handleFeaturedCheckoutCompleted(session);
                    supplierFeaturedPromotionService.handleFeaturedCheckoutCompleted(session);
                }
                case "account.updated" -> {
                    Account account = (Account) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Handle Connect account status updates
                    stripeConnectService.handleAccountUpdated(account);
                }
                case "payment_intent.succeeded" -> {
                    PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Handle booking payment authorization success
                    bookingPaymentService.handlePaymentIntentSucceeded(paymentIntent);
                }
                case "payment_intent.amount_capturable_updated" -> {
                    // Manual capture mode: this fires instead of payment_intent.succeeded
                    // when the card is authorized but not yet captured
                    PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    bookingPaymentService.handlePaymentIntentSucceeded(paymentIntent);
                }
                case "payment_intent.payment_failed" -> {
                    PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Handle booking payment failure
                    bookingPaymentService.handlePaymentIntentFailed(paymentIntent);
                }
                case "charge.captured" -> {
                    Charge charge = (Charge) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Confirm payment capture for booking
                    String paymentIntentId = charge.getPaymentIntent();
                    if (paymentIntentId != null) {
                        bookingPaymentService.handleChargeCaptured(paymentIntentId);
                    }
                }
                case "charge.refunded" -> {
                    Charge charge = (Charge) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Record refund for booking
                    String paymentIntentId = charge.getPaymentIntent();
                    if (paymentIntentId != null) {
                        bookingPaymentService.handleChargeRefunded(paymentIntentId, charge.getAmountRefunded());
                    }
                }
                case "transfer.created" -> {
                    Transfer transfer = (Transfer) event.getDataObjectDeserializer()
                            .getObject().orElseThrow();
                    // Record owner payout
                    var transferMetadata = transfer.getMetadata();
                    String bookingId = transferMetadata != null ? transferMetadata.get("booking_id") : null;
                    bookingPaymentService.handleTransferCreated(transfer.getId(), bookingId);
                }
                default -> log.debug("Unhandled event type: {}", event.getType());
            }
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing failed");
        }

        return ResponseEntity.ok("Webhook processed");
    }
}
