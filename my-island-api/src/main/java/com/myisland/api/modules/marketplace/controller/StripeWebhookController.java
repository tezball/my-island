package com.myisland.api.modules.marketplace.controller;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.service.OwnerSubscriptionService;
import com.myisland.api.modules.marketplace.service.SubscriptionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
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
    private final StripeProperties stripeProperties;

    public StripeWebhookController(
            SubscriptionService supplierSubscriptionService,
            OwnerSubscriptionService ownerSubscriptionService,
            StripeProperties stripeProperties) {
        this.supplierSubscriptionService = supplierSubscriptionService;
        this.ownerSubscriptionService = ownerSubscriptionService;
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

        log.info("Received Stripe webhook: {}", event.getType());

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
                default -> log.debug("Unhandled event type: {}", event.getType());
            }
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing failed");
        }

        return ResponseEntity.ok("Webhook processed");
    }
}
