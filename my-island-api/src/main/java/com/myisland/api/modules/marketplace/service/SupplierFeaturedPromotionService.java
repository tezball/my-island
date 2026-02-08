package com.myisland.api.modules.marketplace.service;

import com.myisland.api.config.StripeProperties;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
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
public class SupplierFeaturedPromotionService {

    private static final Logger log = LoggerFactory.getLogger(SupplierFeaturedPromotionService.class);

    // Pricing in cents (same as Owner featured)
    private static final Map<String, Long> FEATURED_PRICES = Map.of(
            "7_DAYS", 999L,   // €9.99
            "30_DAYS", 2999L  // €29.99
    );

    private final SupplierRepository supplierRepository;
    private final StripeProperties stripeProperties;

    public SupplierFeaturedPromotionService(SupplierRepository supplierRepository, StripeProperties stripeProperties) {
        this.supplierRepository = supplierRepository;
        this.stripeProperties = stripeProperties;
    }

    @Transactional
    public String createFeaturedCheckout(Long userId, String duration) throws StripeException {
        Supplier supplier = supplierRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier profile not found for user"));

        Long priceInCents = FEATURED_PRICES.get(duration);
        if (priceInCents == null) {
            throw new BadRequestException("Invalid duration. Must be '7_DAYS' or '30_DAYS'");
        }

        String productName = "Featured Promotion - " + duration.replace("_", " ");

        String successUrl = stripeProperties.getSupplierSuccessUrl();
        String cancelUrl = stripeProperties.getSupplierCancelUrl();

        // Fallback to default URLs if not configured
        if (successUrl == null || successUrl.isBlank()) {
            successUrl = "http://localhost:5173/supplier/settings?featured=success";
        }
        if (cancelUrl == null || cancelUrl.isBlank()) {
            cancelUrl = "http://localhost:5173/supplier/settings?featured=cancelled";
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
                                        .setDescription("Get your business featured on the My Island marketplace")
                                        .build())
                                .build())
                        .setQuantity(1L)
                        .build())
                .putMetadata("supplier_id", supplier.getId().toString())
                .putMetadata("duration", duration)
                .putMetadata("type", "supplier_featured_promotion")
                .build();

        Session session = Session.create(params);
        log.info("Created supplier featured checkout session {} for supplier {} with duration {}",
                session.getId(), supplier.getId(), duration);

        return session.getUrl();
    }

    @Transactional
    public void handleFeaturedCheckoutCompleted(Session session) {
        Map<String, String> metadata = session.getMetadata();

        // Only process supplier featured promotions
        if (metadata == null || !"supplier_featured_promotion".equals(metadata.get("type"))) {
            return;
        }

        Long supplierId = Long.parseLong(metadata.get("supplier_id"));
        String duration = metadata.get("duration");

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", supplierId));

        LocalDateTime newExpiry = calculateFeaturedExpiry(supplier, duration);

        supplier.setFeatured(true);
        supplier.setFeaturedUntil(newExpiry);
        supplier.setFeaturedPurchaseId(session.getId());
        supplierRepository.save(supplier);

        log.info("Featured promotion activated for supplier {} until {}", supplierId, newExpiry);
    }

    private LocalDateTime calculateFeaturedExpiry(Supplier supplier, String duration) {
        // If already featured, extend from current expiry; otherwise start from now
        LocalDateTime baseTime = supplier.isCurrentlyFeatured() ? supplier.getFeaturedUntil() : LocalDateTime.now();

        return switch (duration) {
            case "7_DAYS" -> baseTime.plusDays(7);
            case "30_DAYS" -> baseTime.plusDays(30);
            default -> throw new BadRequestException("Invalid duration");
        };
    }
}
