package com.myisland.api.modules.accommodation.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.dto.OwnerSubscriptionDto;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
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

        // Create checkout session for €20/month owner subscription
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(stripeProperties.getOwnerSuccessUrl())
                .setCancelUrl(stripeProperties.getOwnerCancelUrl())
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
    public CreatePortalSessionResponse createPortalSession(Long ownerId) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

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
        owner.setSubscriptionCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
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
        owner.setSubscriptionCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
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
