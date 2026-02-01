package com.myisland.api.modules.marketplace;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myisland.api.modules.identity.dto.SignupRequest;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.dto.ClaimOfferRequest;
import com.myisland.api.modules.marketplace.entity.Offer;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.marketplace.repository.OfferRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.support.BddTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Marketplace API")
class MarketplaceControllerTest extends BddTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private OfferClaimRepository offerClaimRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Supplier testSupplier;
    private Offer testOffer;

    @BeforeEach
    void setUp() {
        resetScenario();
        setupTestData();
    }

    private void setupTestData() {
        // Clean up
        offerClaimRepository.deleteAll();
        offerRepository.deleteAll();
        supplierRepository.deleteAll();

        // Create supplier user
        User supplierUser = userRepository.save(User.builder()
                .email("marketplace-supplier@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .name("Test Supplier")
                .role(User.UserRole.SUPPLIER)
                .isSupplier(true)
                .build());

        // Create supplier
        testSupplier = supplierRepository.save(Supplier.builder()
                .user(supplierUser)
                .businessName("Test Farm Shop")
                .category(Supplier.SupplierCategory.FARM_SHOP)
                .county("Wicklow")
                .description("Fresh local produce")
                .build());

        // Create offer
        testOffer = offerRepository.save(Offer.builder()
                .supplier(testSupplier)
                .title("10% Off Fresh Produce")
                .description("Get 10% off all vegetables")
                .discountType(Offer.DiscountType.PERCENTAGE)
                .discountValue(BigDecimal.valueOf(10))
                .validFrom(LocalDate.now().minusDays(1))
                .validUntil(LocalDate.now().plusDays(30))
                .maxClaims(100)
                .isActive(true)
                .build());
    }

    private String createUserAndGetToken(String email) throws Exception {
        var signupRequest = new SignupRequest(email, "password123", "Test User");
        var signupResult = mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andReturn();

        return objectMapper.readTree(signupResult.getResponse().getContentAsString())
                .get("token").asText();
    }

    @Nested
    @DisplayName("GET /marketplace/suppliers")
    class GetSuppliers {

        @Test
        @DisplayName("Given suppliers exist, When I list suppliers, Then all suppliers returned")
        void shouldReturnAllSuppliers() throws Exception {
            // When
            result = mockMvc.perform(get("/marketplace/suppliers"));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                    .andExpect(jsonPath("$[*].businessName", hasItem("Test Farm Shop")));
        }
    }

    @Nested
    @DisplayName("GET /marketplace/offers")
    class GetOffers {

        @Test
        @DisplayName("Given active offers exist, When I list offers, Then available offers returned")
        void shouldReturnAvailableOffers() throws Exception {
            // When
            result = mockMvc.perform(get("/marketplace/offers"));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                    .andExpect(jsonPath("$[*].title", hasItem("10% Off Fresh Produce")))
                    .andExpect(jsonPath("$[0].isAvailable").value(true));
        }
    }

    @Nested
    @DisplayName("GET /marketplace/offers/{id}")
    class GetOfferById {

        @Test
        @DisplayName("Given offer exists, When I get by ID, Then offer details returned")
        void shouldReturnOfferDetails() throws Exception {
            // When
            result = mockMvc.perform(get("/marketplace/offers/{id}", testOffer.getId()));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.title").value("10% Off Fresh Produce"))
                    .andExpect(jsonPath("$.discountType").value("PERCENTAGE"))
                    .andExpect(jsonPath("$.discountValue").value(10))
                    .andExpect(jsonPath("$.supplierName").value("Test Farm Shop"));
        }
    }

    @Nested
    @DisplayName("POST /marketplace/offers/claim")
    class ClaimOffer {

        @Test
        @DisplayName("Given valid offer, When I claim offer, Then claim is created with code")
        void shouldCreateClaim() throws Exception {
            // Given
            authToken = createUserAndGetToken("claimer1@example.com");
            var request = new ClaimOfferRequest(testOffer.getId(), null);

            // When
            result = mockMvc.perform(post("/marketplace/offers/claim")
                    .header("Authorization", "Bearer " + authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // Then
            result.andExpect(status().isCreated())
                    .andExpect(jsonPath("$.offerId").value(testOffer.getId()))
                    .andExpect(jsonPath("$.claimCode").exists())
                    .andExpect(jsonPath("$.status").value("CLAIMED"))
                    .andExpect(jsonPath("$.isValid").value(true));
        }

        @Test
        @DisplayName("Given already claimed, When I claim again, Then error returned")
        void shouldRejectDuplicateClaim() throws Exception {
            // Given - First claim
            authToken = createUserAndGetToken("claimer2@example.com");
            var request = new ClaimOfferRequest(testOffer.getId(), null);
            mockMvc.perform(post("/marketplace/offers/claim")
                    .header("Authorization", "Bearer " + authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // When - Second claim
            result = mockMvc.perform(post("/marketplace/offers/claim")
                    .header("Authorization", "Bearer " + authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // Then
            result.andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(containsString("already claimed")));
        }

        @Test
        @DisplayName("Given no auth token, When I claim offer, Then unauthorized")
        void shouldRequireAuthentication() throws Exception {
            // Given
            var request = new ClaimOfferRequest(testOffer.getId(), null);

            // When
            result = mockMvc.perform(post("/marketplace/offers/claim")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // Then
            result.andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("GET /marketplace/claims")
    class GetUserClaims {

        @Test
        @DisplayName("Given user has claims, When I list claims, Then my claims returned")
        void shouldReturnUserClaims() throws Exception {
            // Given - Create claim
            authToken = createUserAndGetToken("claimer3@example.com");
            var request = new ClaimOfferRequest(testOffer.getId(), null);
            mockMvc.perform(post("/marketplace/offers/claim")
                    .header("Authorization", "Bearer " + authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            // When
            result = mockMvc.perform(get("/marketplace/claims")
                    .header("Authorization", "Bearer " + authToken));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].offerTitle").value("10% Off Fresh Produce"));
        }
    }
}
