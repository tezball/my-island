package com.myisland.api.modules.marketplace.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.marketplace.dto.ConnectStatusDto;
import com.myisland.api.modules.marketplace.dto.OnboardingLinkResponse;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class StripeConnectService {

    private static final Logger log = LoggerFactory.getLogger(StripeConnectService.class);

    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;
    private final StripeProperties stripeProperties;

    public StripeConnectService(
            OwnerRepository ownerRepository,
            SupplierRepository supplierRepository,
            StripeProperties stripeProperties) {
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
        this.stripeProperties = stripeProperties;
    }

    // Owner methods
    @Transactional
    public OnboardingLinkResponse createOwnerOnboardingLink(Long ownerId, String returnUrl, String refreshUrl) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Dev mode: return mock URL
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Returning mock onboarding link for owner {}", ownerId);
            owner.setStripeConnectAccountId("acct_dev_owner_" + ownerId);
            owner.setConnectOnboardingComplete(true);
            owner.setPayoutsEnabled(true);
            ownerRepository.save(owner);
            return new OnboardingLinkResponse(returnUrl + "?connect=success", true);
        }

        // Create or get Connect account
        String accountId = owner.getStripeConnectAccountId();
        if (accountId == null) {
            Account account = Account.create(
                    AccountCreateParams.builder()
                            .setType(AccountCreateParams.Type.EXPRESS)
                            .setEmail(owner.getUser().getEmail())
                            .setBusinessProfile(
                                    AccountCreateParams.BusinessProfile.builder()
                                            .setName(owner.getPropertyName())
                                            .build()
                            )
                            .putMetadata("owner_id", ownerId.toString())
                            .build()
            );
            accountId = account.getId();
            owner.setStripeConnectAccountId(accountId);
            ownerRepository.save(owner);
            log.info("Created Connect account {} for owner {}", accountId, ownerId);
        }

        // Create onboarding link
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(accountId)
                        .setRefreshUrl(refreshUrl)
                        .setReturnUrl(returnUrl)
                        .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                        .build()
        );

        log.info("Created onboarding link for owner {}", ownerId);
        return new OnboardingLinkResponse(accountLink.getUrl(), false);
    }

    public ConnectStatusDto getOwnerConnectStatus(Long ownerId) throws StripeException {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getStripeConnectAccountId() == null) {
            return new ConnectStatusDto(false, false, false, null);
        }

        // Dev mode: return stored status
        if (stripeProperties.isDevMode()) {
            return new ConnectStatusDto(
                    true,
                    owner.isConnectOnboardingComplete(),
                    owner.isPayoutsEnabled(),
                    owner.getStripeConnectAccountId()
            );
        }

        // Check account status with Stripe
        Account account = Account.retrieve(owner.getStripeConnectAccountId());
        boolean onboardingComplete = account.getDetailsSubmitted() != null && account.getDetailsSubmitted();
        boolean payoutsEnabled = account.getPayoutsEnabled() != null && account.getPayoutsEnabled();

        // Update local status if changed
        if (owner.isConnectOnboardingComplete() != onboardingComplete ||
                owner.isPayoutsEnabled() != payoutsEnabled) {
            owner.setConnectOnboardingComplete(onboardingComplete);
            owner.setPayoutsEnabled(payoutsEnabled);
            ownerRepository.save(owner);
        }

        return new ConnectStatusDto(
                true,
                onboardingComplete,
                payoutsEnabled,
                owner.getStripeConnectAccountId()
        );
    }

    // Supplier methods
    @Transactional
    public OnboardingLinkResponse createSupplierOnboardingLink(Long supplierId, String returnUrl, String refreshUrl) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Dev mode: return mock URL
        if (stripeProperties.isDevMode()) {
            log.info("Dev mode: Returning mock onboarding link for supplier {}", supplierId);
            supplier.setStripeConnectAccountId("acct_dev_supplier_" + supplierId);
            supplier.setConnectOnboardingComplete(true);
            supplier.setPayoutsEnabled(true);
            supplierRepository.save(supplier);
            return new OnboardingLinkResponse(returnUrl + "?connect=success", true);
        }

        // Create or get Connect account
        String accountId = supplier.getStripeConnectAccountId();
        if (accountId == null) {
            Account account = Account.create(
                    AccountCreateParams.builder()
                            .setType(AccountCreateParams.Type.EXPRESS)
                            .setEmail(supplier.getUser().getEmail())
                            .setBusinessProfile(
                                    AccountCreateParams.BusinessProfile.builder()
                                            .setName(supplier.getBusinessName())
                                            .build()
                            )
                            .putMetadata("supplier_id", supplierId.toString())
                            .build()
            );
            accountId = account.getId();
            supplier.setStripeConnectAccountId(accountId);
            supplierRepository.save(supplier);
            log.info("Created Connect account {} for supplier {}", accountId, supplierId);
        }

        // Create onboarding link
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(accountId)
                        .setRefreshUrl(refreshUrl)
                        .setReturnUrl(returnUrl)
                        .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                        .build()
        );

        log.info("Created onboarding link for supplier {}", supplierId);
        return new OnboardingLinkResponse(accountLink.getUrl(), false);
    }

    public ConnectStatusDto getSupplierConnectStatus(Long supplierId) throws StripeException {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        if (supplier.getStripeConnectAccountId() == null) {
            return new ConnectStatusDto(false, false, false, null);
        }

        // Dev mode: return stored status
        if (stripeProperties.isDevMode()) {
            return new ConnectStatusDto(
                    true,
                    supplier.isConnectOnboardingComplete(),
                    supplier.isPayoutsEnabled(),
                    supplier.getStripeConnectAccountId()
            );
        }

        // Check account status with Stripe
        Account account = Account.retrieve(supplier.getStripeConnectAccountId());
        boolean onboardingComplete = account.getDetailsSubmitted() != null && account.getDetailsSubmitted();
        boolean payoutsEnabled = account.getPayoutsEnabled() != null && account.getPayoutsEnabled();

        // Update local status if changed
        if (supplier.isConnectOnboardingComplete() != onboardingComplete ||
                supplier.isPayoutsEnabled() != payoutsEnabled) {
            supplier.setConnectOnboardingComplete(onboardingComplete);
            supplier.setPayoutsEnabled(payoutsEnabled);
            supplierRepository.save(supplier);
        }

        return new ConnectStatusDto(
                true,
                onboardingComplete,
                payoutsEnabled,
                supplier.getStripeConnectAccountId()
        );
    }

    // Webhook handler for account.updated events
    @Transactional
    public void handleAccountUpdated(Account account) {
        String accountId = account.getId();

        // Check if it's an owner account
        Optional<Owner> ownerOpt = ownerRepository.findByStripeConnectAccountId(accountId);
        if (ownerOpt.isPresent()) {
            Owner owner = ownerOpt.get();
            boolean onboardingComplete = account.getDetailsSubmitted() != null && account.getDetailsSubmitted();
            boolean payoutsEnabled = account.getPayoutsEnabled() != null && account.getPayoutsEnabled();

            owner.setConnectOnboardingComplete(onboardingComplete);
            owner.setPayoutsEnabled(payoutsEnabled);
            ownerRepository.save(owner);

            log.info("Updated Connect status for owner {}: onboarding={}, payouts={}",
                    owner.getId(), onboardingComplete, payoutsEnabled);
            return;
        }

        // Check if it's a supplier account
        Optional<Supplier> supplierOpt = supplierRepository.findByStripeConnectAccountId(accountId);
        if (supplierOpt.isPresent()) {
            Supplier supplier = supplierOpt.get();
            boolean onboardingComplete = account.getDetailsSubmitted() != null && account.getDetailsSubmitted();
            boolean payoutsEnabled = account.getPayoutsEnabled() != null && account.getPayoutsEnabled();

            supplier.setConnectOnboardingComplete(onboardingComplete);
            supplier.setPayoutsEnabled(payoutsEnabled);
            supplierRepository.save(supplier);

            log.info("Updated Connect status for supplier {}: onboarding={}, payouts={}",
                    supplier.getId(), onboardingComplete, payoutsEnabled);
            return;
        }

        log.debug("No owner or supplier found for Connect account {}", accountId);
    }
}
