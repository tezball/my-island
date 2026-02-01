package com.myisland.api.modules.marketplace.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.myisland.api.modules.marketplace.dto.SubscriptionDto;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
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
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    private final SupplierRepository supplierRepository;
    private final StripeProperties stripeProperties;

    public SubscriptionService(SupplierRepository supplierRepository, StripeProperties stripeProperties) {
        this.supplierRepository = supplierRepository;
        this.stripeProperties = stripeProperties;
    }

    public SubscriptionDto getSubscriptionStatus(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return SubscriptionDto.from(supplier);
    }

    @Transactional
    public CreateCheckoutSessionResponse createCheckoutSession(Long supplierId, String userEmail) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Create or get Stripe customer
        String customerId = supplier.getStripeCustomerId();
        if (customerId == null) {
            Customer customer = Customer.create(
                    CustomerCreateParams.builder()
                            .setEmail(userEmail)
                            .setName(supplier.getBusinessName())
                            .putMetadata("supplier_id", supplierId.toString())
                            .build()
            );
            customerId = customer.getId();
            supplier.setStripeCustomerId(customerId);
            supplierRepository.save(supplier);
        }

        // Create checkout session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(stripeProperties.getSupplierSuccessUrl())
                .setCancelUrl(stripeProperties.getSupplierCancelUrl())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(stripeProperties.getSupplierPriceId())
                                .setQuantity(1L)
                                .build()
                )
                .putMetadata("supplier_id", supplierId.toString())
                .build();

        Session session = Session.create(params);
        log.info("Created checkout session {} for supplier {}", session.getId(), supplierId);

        return new CreateCheckoutSessionResponse(session.getUrl());
    }

    @Transactional
    public CreatePortalSessionResponse createPortalSession(Long supplierId) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        if (supplier.getStripeCustomerId() == null) {
            throw new RuntimeException("No Stripe customer found for this supplier");
        }

        com.stripe.param.billingportal.SessionCreateParams params =
                com.stripe.param.billingportal.SessionCreateParams.builder()
                        .setCustomer(supplier.getStripeCustomerId())
                        .setReturnUrl(stripeProperties.getSupplierSuccessUrl().replace("?subscription=success", "/settings"))
                        .build();

        com.stripe.model.billingportal.Session session = com.stripe.model.billingportal.Session.create(params);
        log.info("Created portal session for supplier {}", supplierId);

        return new CreatePortalSessionResponse(session.getUrl());
    }

    @Transactional
    public void handleSubscriptionCreated(Subscription subscription) {
        String customerId = subscription.getCustomer();
        Optional<Supplier> supplierOpt = supplierRepository.findByStripeCustomerId(customerId);

        if (supplierOpt.isEmpty()) {
            log.debug("No supplier found for Stripe customer {} (may be an owner)", customerId);
            return;
        }

        Supplier supplier = supplierOpt.get();
        supplier.setStripeSubscriptionId(subscription.getId());
        supplier.setSubscriptionStatus(mapStripeStatus(subscription.getStatus()));
        supplier.setSubscriptionCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
        supplier.setSubscriptionCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        supplierRepository.save(supplier);

        log.info("Subscription created for supplier {}: status={}", supplier.getId(), subscription.getStatus());
    }

    @Transactional
    public void handleSubscriptionUpdated(Subscription subscription) {
        String customerId = subscription.getCustomer();
        Optional<Supplier> supplierOpt = supplierRepository.findByStripeCustomerId(customerId);

        if (supplierOpt.isEmpty()) {
            log.debug("No supplier found for Stripe customer {} (may be an owner)", customerId);
            return;
        }

        Supplier supplier = supplierOpt.get();
        supplier.setSubscriptionStatus(mapStripeStatus(subscription.getStatus()));
        supplier.setSubscriptionCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
        supplier.setSubscriptionCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        supplierRepository.save(supplier);

        log.info("Subscription updated for supplier {}: status={}", supplier.getId(), subscription.getStatus());
    }

    @Transactional
    public void handleSubscriptionDeleted(Subscription subscription) {
        String customerId = subscription.getCustomer();
        Optional<Supplier> supplierOpt = supplierRepository.findByStripeCustomerId(customerId);

        if (supplierOpt.isEmpty()) {
            log.debug("No supplier found for Stripe customer {} (may be an owner)", customerId);
            return;
        }

        Supplier supplier = supplierOpt.get();
        supplier.setSubscriptionStatus(Supplier.SubscriptionStatus.CANCELED);
        supplier.setStripeSubscriptionId(null);
        supplierRepository.save(supplier);

        log.info("Subscription deleted for supplier {}", supplier.getId());
    }

    private Supplier.SubscriptionStatus mapStripeStatus(String stripeStatus) {
        return switch (stripeStatus) {
            case "active", "trialing" -> Supplier.SubscriptionStatus.ACTIVE;
            case "past_due" -> Supplier.SubscriptionStatus.PAST_DUE;
            case "canceled" -> Supplier.SubscriptionStatus.CANCELED;
            case "unpaid" -> Supplier.SubscriptionStatus.UNPAID;
            default -> Supplier.SubscriptionStatus.NONE;
        };
    }
}
