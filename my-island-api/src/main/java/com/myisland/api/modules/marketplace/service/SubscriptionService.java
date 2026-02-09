package com.myisland.api.modules.marketplace.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.marketplace.dto.ConfirmSubscriptionRequest;
import com.myisland.api.modules.marketplace.dto.CreateCheckoutSessionResponse;
import com.myisland.api.modules.marketplace.dto.CreatePortalSessionResponse;
import com.myisland.api.modules.marketplace.dto.SetupIntentResponse;
import com.myisland.api.modules.marketplace.dto.SubscriptionDto;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
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

        // Dev mode: directly activate subscription and redirect to success URL
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Activating subscription directly for supplier {}", supplierId);
            supplier.setStripeCustomerId("cus_dev_supplier_" + supplierId);
            supplier.setStripeSubscriptionId("sub_dev_supplier_" + supplierId);
            supplier.setSubscriptionStatus(Supplier.SubscriptionStatus.ACTIVE);
            supplier.setSubscriptionCurrentPeriodEnd(Instant.now().plusSeconds(30 * 24 * 60 * 60)); // 30 days
            supplier.setSubscriptionCancelAtPeriodEnd(false);
            supplierRepository.save(supplier);
            return new CreateCheckoutSessionResponse(stripeProperties.getSupplierSuccessUrl());
        }

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

        // Create checkout session (card only)
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(stripeProperties.getSupplierSuccessUrl())
                .setCancelUrl(stripeProperties.getSupplierCancelUrl())
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
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
    public SetupIntentResponse createSetupIntent(Long supplierId, String userEmail) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Dev mode: return mock data
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Returning mock setup intent for supplier {}", supplierId);
            String customerId = supplier.getStripeCustomerId();
            if (customerId == null) {
                customerId = "cus_dev_supplier_" + supplierId;
                supplier.setStripeCustomerId(customerId);
                supplierRepository.save(supplier);
            }
            return new SetupIntentResponse(
                    "seti_dev_supplier_" + supplierId + "_secret",
                    customerId,
                    stripeProperties.getPublishableKey(),
                    true
            );
        }

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

        // Create SetupIntent
        SetupIntentCreateParams params = SetupIntentCreateParams.builder()
                .setCustomer(customerId)
                .addPaymentMethodType("card")
                .putMetadata("supplier_id", supplierId.toString())
                .build();

        SetupIntent setupIntent = SetupIntent.create(params);
        log.info("Created setup intent {} for supplier {}", setupIntent.getId(), supplierId);

        return new SetupIntentResponse(
                setupIntent.getClientSecret(),
                customerId,
                stripeProperties.getPublishableKey(),
                false
        );
    }

    @Transactional
    public SubscriptionDto confirmSubscription(Long supplierId, ConfirmSubscriptionRequest request) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Dev mode: directly activate subscription
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Activating subscription directly for supplier {}", supplierId);
            supplier.setStripeSubscriptionId("sub_dev_supplier_" + supplierId);
            supplier.setSubscriptionStatus(Supplier.SubscriptionStatus.ACTIVE);
            supplier.setSubscriptionCurrentPeriodEnd(Instant.now().plusSeconds(30 * 24 * 60 * 60)); // 30 days
            supplier.setSubscriptionCancelAtPeriodEnd(false);
            supplierRepository.save(supplier);
            return SubscriptionDto.from(supplier);
        }

        if (supplier.getStripeCustomerId() == null) {
            throw new RuntimeException("No Stripe customer found for this supplier");
        }

        // Attach payment method to customer
        PaymentMethod paymentMethod = PaymentMethod.retrieve(request.paymentMethodId());
        paymentMethod.attach(
                PaymentMethodAttachParams.builder()
                        .setCustomer(supplier.getStripeCustomerId())
                        .build()
        );

        // Set as default payment method
        Customer customer = Customer.retrieve(supplier.getStripeCustomerId());
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
                .setCustomer(supplier.getStripeCustomerId())
                .addItem(
                        SubscriptionCreateParams.Item.builder()
                                .setPrice(stripeProperties.getSupplierPriceId())
                                .build()
                )
                .setDefaultPaymentMethod(request.paymentMethodId())
                .putMetadata("supplier_id", supplierId.toString())
                .build();

        Subscription subscription = Subscription.create(params);
        log.info("Created subscription {} for supplier {}", subscription.getId(), supplierId);

        // Update supplier with subscription details
        supplier.setStripeSubscriptionId(subscription.getId());
        supplier.setSubscriptionStatus(mapStripeStatus(subscription.getStatus()));
        supplier.setSubscriptionCurrentPeriodEnd(extractPeriodEnd(subscription));
        supplier.setSubscriptionCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        supplierRepository.save(supplier);

        return SubscriptionDto.from(supplier);
    }

    @Transactional
    public CreatePortalSessionResponse createPortalSession(Long supplierId) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Dev mode: no real Stripe portal available
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Billing portal not available for supplier {}", supplierId);
            return new CreatePortalSessionResponse(null, true);
        }

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
        supplier.setSubscriptionCurrentPeriodEnd(extractPeriodEnd(subscription));
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
        supplier.setSubscriptionCurrentPeriodEnd(extractPeriodEnd(subscription));
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

    private Instant extractPeriodEnd(Subscription subscription) {
        Long periodEnd = subscription.getCurrentPeriodEnd();
        if (periodEnd != null) {
            return Instant.ofEpochSecond(periodEnd);
        }
        return Instant.now().plusSeconds(30L * 24 * 60 * 60);
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
