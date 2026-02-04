package com.myisland.api.modules.accommodation.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class FeaturedPromotionService {

    private static final Logger log = LoggerFactory.getLogger(FeaturedPromotionService.class);

    // Pricing in cents
    private static final Map<String, Long> FEATURED_PRICES = Map.of(
            "7_DAYS", 999L,   // €9.99
            "30_DAYS", 2999L  // €29.99
    );

    private final OwnerRepository ownerRepository;
    private final StripeProperties stripeProperties;

    public FeaturedPromotionService(OwnerRepository ownerRepository, StripeProperties stripeProperties) {
        this.ownerRepository = ownerRepository;
        this.stripeProperties = stripeProperties;
    }

    @Transactional
    public String createFeaturedCheckout(Long userId, String duration) throws StripeException {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found for user"));

        Long priceInCents = FEATURED_PRICES.get(duration);
        if (priceInCents == null) {
            throw new BadRequestException("Invalid duration. Must be '7_DAYS' or '30_DAYS'");
        }

        String productName = "Featured Promotion - " + duration.replace("_", " ");

        String successUrl = stripeProperties.getFeaturedSuccessUrl();
        String cancelUrl = stripeProperties.getFeaturedCancelUrl();

        // Fallback to owner URLs if featured URLs not configured
        if (successUrl == null || successUrl.isBlank()) {
            successUrl = stripeProperties.getOwnerSuccessUrl().replace("subscription=success", "featured=success");
        }
        if (cancelUrl == null || cancelUrl.isBlank()) {
            cancelUrl = stripeProperties.getOwnerCancelUrl().replace("subscription=cancelled", "featured=cancelled");
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount(priceInCents)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(productName)
                                        .setDescription("Get your campsite featured on the My Island homepage")
                                        .build())
                                .build())
                        .setQuantity(1L)
                        .build())
                .putMetadata("owner_id", owner.getId().toString())
                .putMetadata("duration", duration)
                .putMetadata("type", "featured_promotion")
                .build();

        Session session = Session.create(params);
        log.info("Created featured checkout session {} for owner {} with duration {}",
                session.getId(), owner.getId(), duration);

        return session.getUrl();
    }

    @Transactional
    public void handleFeaturedCheckoutCompleted(Session session) {
        Map<String, String> metadata = session.getMetadata();

        // Only process featured promotions
        if (!"featured_promotion".equals(metadata.get("type"))) {
            return;
        }

        Long ownerId = Long.parseLong(metadata.get("owner_id"));
        String duration = metadata.get("duration");

        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", ownerId));

        LocalDateTime newExpiry = calculateFeaturedExpiry(owner, duration);

        owner.setFeatured(true);
        owner.setFeaturedUntil(newExpiry);
        owner.setFeaturedPurchaseId(session.getId());
        ownerRepository.save(owner);

        log.info("Featured promotion activated for owner {} until {}", ownerId, newExpiry);
    }

    private LocalDateTime calculateFeaturedExpiry(Owner owner, String duration) {
        // If already featured, extend from current expiry; otherwise start from now
        LocalDateTime baseTime = owner.isCurrentlyFeatured() ? owner.getFeaturedUntil() : LocalDateTime.now();

        return switch (duration) {
            case "7_DAYS" -> baseTime.plusDays(7);
            case "30_DAYS" -> baseTime.plusDays(30);
            default -> throw new BadRequestException("Invalid duration");
        };
    }
}
