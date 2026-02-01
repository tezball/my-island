package com.myisland.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "stripe")
public class StripeProperties {

    private String apiKey;
    private String webhookSecret;
    private String supplierPriceId;
    private String ownerPriceId;
    private String supplierSuccessUrl;
    private String supplierCancelUrl;
    private String ownerSuccessUrl;
    private String ownerCancelUrl;

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getWebhookSecret() { return webhookSecret; }
    public void setWebhookSecret(String webhookSecret) { this.webhookSecret = webhookSecret; }

    public String getSupplierPriceId() { return supplierPriceId; }
    public void setSupplierPriceId(String supplierPriceId) { this.supplierPriceId = supplierPriceId; }

    public String getOwnerPriceId() { return ownerPriceId; }
    public void setOwnerPriceId(String ownerPriceId) { this.ownerPriceId = ownerPriceId; }

    public String getSupplierSuccessUrl() { return supplierSuccessUrl; }
    public void setSupplierSuccessUrl(String supplierSuccessUrl) { this.supplierSuccessUrl = supplierSuccessUrl; }

    public String getSupplierCancelUrl() { return supplierCancelUrl; }
    public void setSupplierCancelUrl(String supplierCancelUrl) { this.supplierCancelUrl = supplierCancelUrl; }

    public String getOwnerSuccessUrl() { return ownerSuccessUrl; }
    public void setOwnerSuccessUrl(String ownerSuccessUrl) { this.ownerSuccessUrl = ownerSuccessUrl; }

    public String getOwnerCancelUrl() { return ownerCancelUrl; }
    public void setOwnerCancelUrl(String ownerCancelUrl) { this.ownerCancelUrl = ownerCancelUrl; }
}
