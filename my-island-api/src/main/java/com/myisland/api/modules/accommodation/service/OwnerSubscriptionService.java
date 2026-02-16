package com.myisland.api.modules.accommodation.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.dto.OwnerSubscriptionDto;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.marketplace.dto.ConfirmSubscriptionRequest;
import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.myisland.api.modules.marketplace.dto.SetupIntentResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.SetupIntent;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.SetupIntentCreateParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class OwnerSubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(OwnerSubscriptionService.class);

    private final OwnerRepository ownerRepository;
    private final StripeProperties stripeProperties;

    public OwnerSubscriptionService(OwnerRepository ownerRepository, StripeProperties stripeProperties) {
        this.ownerRepository = ownerRepository;
        this.stripeProperties = stripeProperties;
    }

    public OwnerSubscriptionDto getSubscriptionStatus(Long ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return OwnerSubscriptionDto.from(owner);
    }

    @Transactional
    public CreateCheckoutSessionResponse createCheckoutSession(Long ownerId, String userEmail) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Dev mode: directly activate subscription and redirect to success URL
        if (stripeProperties.isDevMode()) {
            log.debug("Dev mode: Activating subscription directly for owner {}", ownerId);
            owner.setStripeCustomerId("cus_dev_" + ownerId);
            owner.setStripeSubscriptionId("sub_dev_" + ownerId);
            owner.setSubscriptionStatus(Owner.SubscriptionStatus.ACTIVE);
            owner.setSubscriptionCurrentPeriodEnd(Instant.now().plusSeconds(30 * 24 * 60 * 60)); // 30 days
            owner.setSubscriptionCancelAtPeriodEnd(false);
            ownerRepository.save(owner);
            return new CreateCheckoutSessionResponse(stripeProperties.getOwnerSuccessUrl());
        }

        // Create or get Stripe customer
        String customerId = owner.getStripeCustomerId();
        if (customerId == null) {
            Customer customer = Customer.create(
                    CustomerCreateParams.builder()
                            .setEmail(userEmail)
                            .setName(owner.getPropertyName())
                            .putMetadata("owner_id", ownerId.toString())
                            .build()
            );
            customerId = customer.getId();
            owner.setStripeCustomerId(customerId);
            ownerRepository.save(owner);
        }

        // Create checkout session for €15/month owner subscription (card only)
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(stripeProperties.getOwnerSuccessUrl())
                .setCancelUrl(stripeProperties.getOwnerCancelUrl())
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(stripeProperties.getOwnerPriceId())
                                .setQuantity(1L)
                                .build()
                )
                .putMetadata("owner_id", ownerId.toString())
                .build();

        Session session = Session.create(params);
        log.info("Created checkout session {} for owner {}", session.getId(), ownerId);

        return new CreateCheckoutSessionResponse(session.getUrl());
    }

    @Transactional
    public SetupIntentResponse createSetupIntent(Long ownerId, String userEmail) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Dev mode: return mock data
        if (stripeProperties.isDevMode()) {
            log.debug("Dev mode: Returning mock setup intent for owner {}", ownerId);
            String customerId = owner.getStripeCustomerId();
            if (customerId == null) {
                customerId = "cus_dev_" + ownerId;
                owner.setStripeCustomerId(customerId);
                ownerRepository.save(owner);
            }
            return new SetupIntentResponse(
                    "seti_dev_" + ownerId + "_secret",
                    customerId,
                    stripeProperties.getPublishableKey(),
                    true
            );
        }

        // Create or get Stripe customer
        String customerId = owner.getStripeCustomerId();
        if (customerId == null) {
            Customer customer = Customer.create(
                    CustomerCreateParams.builder()
                            .setEmail(userEmail)
                            .setName(owner.getPropertyName())
                            .putMetadata("owner_id", ownerId.toString())
                            .build()
            );
            customerId = customer.getId();
            owner.setStripeCustomerId(customerId);
            ownerRepository.save(owner);
        }

        // Create SetupIntent
        SetupIntentCreateParams params = SetupIntentCreateParams.builder()
                .setCustomer(customerId)
                .addPaymentMethodType("card")
                .putMetadata("owner_id", ownerId.toString())
                .build();

        SetupIntent setupIntent = SetupIntent.create(params);
        log.info("Created setup intent {} for owner {}", setupIntent.getId(), ownerId);

        return new SetupIntentResponse(
                setupIntent.getClientSecret(),
                customerId,
                stripeProperties.getPublishableKey(),
                false
        );
    }

    @Transactional
    public OwnerSubscriptionDto confirmSubscription(Long ownerId, ConfirmSubscriptionRequest request) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Dev mode: directly activate subscription
        if (stripeProperties.isDevMode()) {
            log.debug("Dev mode: Activating subscription directly for owner {}", ownerId);
            owner.setStripeSubscriptionId("sub_dev_" + ownerId);
            owner.setSubscriptionStatus(Owner.SubscriptionStatus.ACTIVE);
            owner.setSubscriptionCurrentPeriodEnd(Instant.now().plusSeconds(30 * 24 * 60 * 60)); // 30 days
            owner.setSubscriptionCancelAtPeriodEnd(false);
            ownerRepository.save(owner);
            return OwnerSubscriptionDto.from(owner);
        }

        if (owner.getStripeCustomerId() == null) {
            throw new RuntimeException("No Stripe customer found for this owner");
        }

        // Attach payment method to customer
        PaymentMethod paymentMethod = PaymentMethod.retrieve(request.paymentMethodId());
        paymentMethod.attach(
                PaymentMethodAttachParams.builder()
                        .setCustomer(owner.getStripeCustomerId())
                        .build()
        );

        // Set as default payment method
        Customer customer = Customer.retrieve(owner.getStripeCustomerId());
        customer.update(
                com.stripe.param.CustomerUpdateParams.builder()
                        .setInvoiceSettings(
                                com.stripe.param.CustomerUpdateParams.InvoiceSettings.builder()
                                        .setDefaultPaymentMethod(request.paymentMethodId())
                                        .build()
                        )
                        .build()
        );

        // Create subscription
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                .setCustomer(owner.getStripeCustomerId())
                .addItem(
                        SubscriptionCreateParams.Item.builder()
                                .setPrice(stripeProperties.getOwnerPriceId())
                                .build()
                )
                .setDefaultPaymentMethod(request.paymentMethodId())
                .putMetadata("owner_id", ownerId.toString())
                .build();

        Subscription subscription = Subscription.create(params);
        log.info("Created subscription {} for owner {}", subscription.getId(), ownerId);

        // Update owner with subscription details
        owner.setStripeSubscriptionId(subscription.getId());
        owner.setSubscriptionStatus(mapStripeStatus(subscription.getStatus()));
        owner.setSubscriptionCurrentPeriodEnd(extractPeriodEnd(subscription));
        owner.setSubscriptionCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        ownerRepository.save(owner);

        return OwnerSubscriptionDto.from(owner);
    }

    @Transactional
    public CreatePortalSessionResponse createPortalSession(Long ownerId) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Dev mode: no real Stripe portal available
        if (stripeProperties.isDevMode()) {
            log.debug("Dev mode: Billing portal not available for owner {}", ownerId);
            return new CreatePortalSessionResponse(null, true);
        }

        if (owner.getStripeCustomerId() == null) {
            throw new RuntimeException("No Stripe customer found for this owner");
        }

        com.stripe.param.billingportal.SessionCreateParams params =
                com.stripe.param.billingportal.SessionCreateParams.builder()
                        .setCustomer(owner.getStripeCustomerId())
                        .setReturnUrl(stripeProperties.getOwnerSuccessUrl().replace("?subscription=success", "/settings"))
                        .build();

        com.stripe.model.billingportal.Session session = com.stripe.model.billingportal.Session.create(params);
        log.info("Created portal session for owner {}", ownerId);

        return new CreatePortalSessionResponse(session.getUrl());
    }

    @Transactional
    public void handleSubscriptionCreated(Subscription subscription) {
        String customerId = subscription.getCustomer();
        Optional<Owner> ownerOpt = ownerRepository.findByStripeCustomerId(customerId);

        if (ownerOpt.isEmpty()) {
            log.debug("No owner found for Stripe customer {} (may be a supplier)", customerId);
            return;
        }

        Owner owner = ownerOpt.get();
        owner.setStripeSubscriptionId(subscription.getId());
        owner.setSubscriptionStatus(mapStripeStatus(subscription.getStatus()));
        owner.setSubscriptionCurrentPeriodEnd(extractPeriodEnd(subscription));
        owner.setSubscriptionCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        ownerRepository.save(owner);

        log.info("Subscription created for owner {}: status={}", owner.getId(), subscription.getStatus());
    }

    @Transactional
    public void handleSubscriptionUpdated(Subscription subscription) {
        String customerId = subscription.getCustomer();
        Optional<Owner> ownerOpt = ownerRepository.findByStripeCustomerId(customerId);

        if (ownerOpt.isEmpty()) {
            log.debug("No owner found for Stripe customer {} (may be a supplier)", customerId);
            return;
        }

        Owner owner = ownerOpt.get();
        owner.setSubscriptionStatus(mapStripeStatus(subscription.getStatus()));
        owner.setSubscriptionCurrentPeriodEnd(extractPeriodEnd(subscription));
        owner.setSubscriptionCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        ownerRepository.save(owner);

        log.info("Subscription updated for owner {}: status={}", owner.getId(), subscription.getStatus());
    }

    @Transactional
    public void handleSubscriptionDeleted(Subscription subscription) {
        String customerId = subscription.getCustomer();
        Optional<Owner> ownerOpt = ownerRepository.findByStripeCustomerId(customerId);

        if (ownerOpt.isEmpty()) {
            log.debug("No owner found for Stripe customer {} (may be a supplier)", customerId);
            return;
        }

        Owner owner = ownerOpt.get();
        owner.setSubscriptionStatus(Owner.SubscriptionStatus.CANCELED);
        owner.setStripeSubscriptionId(null);
        ownerRepository.save(owner);

        log.info("Subscription deleted for owner {}", owner.getId());
    }

    private Instant extractPeriodEnd(Subscription subscription) {
        // Stripe API 2025-03-31+ removed current_period_end from Subscription
        Long periodEnd = subscription.getCurrentPeriodEnd();
        if (periodEnd != null) {
            return Instant.ofEpochSecond(periodEnd);
        }
        // Fallback: 30 days from now
        return Instant.now().plusSeconds(30L * 24 * 60 * 60);
    }

    private Owner.SubscriptionStatus mapStripeStatus(String stripeStatus) {
        return switch (stripeStatus) {
            case "active", "trialing" -> Owner.SubscriptionStatus.ACTIVE;
            case "past_due" -> Owner.SubscriptionStatus.PAST_DUE;
            case "canceled" -> Owner.SubscriptionStatus.CANCELED;
            case "unpaid" -> Owner.SubscriptionStatus.UNPAID;
            default -> Owner.SubscriptionStatus.NONE;
        };
    }
}
