package com.myisland.api.modules.accommodation;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.support.BddTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Campsite API")
class CampsiteControllerTest extends BddTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Owner testOwner;
    private Lot testLot;

    @BeforeEach
    void setUp() {
        resetScenario();
        setupTestData();
    }

    private void setupTestData() {
        // Clean up
        lotRepository.deleteAll();
        ownerRepository.deleteAll();

        // Create test owner user
        User ownerUser = userRepository.save(User.builder()
                .email("testowner@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .name("Test Owner")
                .role(User.UserRole.OWNER)
                .isOwner(true)
                .build());

        // Create test owner
        testOwner = ownerRepository.save(Owner.builder()
                .user(ownerUser)
                .propertyName("Test Campsite")
                .county("Kerry")
                .town("Killarney")
                .propertyType(Owner.PropertyType.TENT)
                .description("A beautiful test campsite")
                .build());

        // Create test lot
        testLot = lotRepository.save(Lot.builder()
                .owner(testOwner)
                .name("Test Pitch")
                .lotType(Lot.LotType.TENT)
                .description("A cozy tent pitch")
                .pricePerNight(BigDecimal.valueOf(25.00))
                .maxGuests(4)
                .isActive(true)
                .build());
    }

    @Nested
    @DisplayName("GET /campsites")
    class GetAllCampsites {

        @Test
        @DisplayName("Given campsites exist, When I list campsites, Then all campsites returned")
        void shouldReturnAllCampsites() throws Exception {
            // When
            result = mockMvc.perform(get("/campsites"));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                    .andExpect(jsonPath("$[*].propertyName", hasItem("Test Campsite")));
        }
    }

    @Nested
    @DisplayName("GET /campsites/{id}")
    class GetCampsiteById {

        @Test
        @DisplayName("Given campsite exists, When I get by ID, Then campsite details returned")
        void shouldReturnCampsiteDetails() throws Exception {
            // When
            result = mockMvc.perform(get("/campsites/{id}", testOwner.getId()));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.propertyName").value("Test Campsite"))
                    .andExpect(jsonPath("$.county").value("Kerry"))
                    .andExpect(jsonPath("$.propertyType").value("TENT"));
        }

        @Test
        @DisplayName("Given campsite does not exist, When I get by ID, Then 404 returned")
        void shouldReturn404ForNonExistent() throws Exception {
            // When
            result = mockMvc.perform(get("/campsites/{id}", 99999L));

            // Then
            result.andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("GET /campsites/{id}/lots")
    class GetCampsiteLots {

        @Test
        @DisplayName("Given campsite has lots, When I get lots, Then active lots returned")
        void shouldReturnActiveLots() throws Exception {
            // When
            result = mockMvc.perform(get("/campsites/{id}/lots", testOwner.getId()));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].name").value("Test Pitch"))
                    .andExpect(jsonPath("$[0].pricePerNight").value(25.00));
        }
    }

    @Nested
    @DisplayName("GET /campsites/{id}/lots/available")
    class GetAvailableLots {

        @Test
        @DisplayName("Given dates with no bookings, When I check availability, Then lot returned")
        void shouldReturnAvailableLots() throws Exception {
            // Given
            LocalDate checkIn = LocalDate.now().plusDays(30);
            LocalDate checkOut = LocalDate.now().plusDays(33);

            // When
            result = mockMvc.perform(get("/campsites/{id}/lots/available", testOwner.getId())
                    .param("checkIn", checkIn.toString())
                    .param("checkOut", checkOut.toString()));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].name").value("Test Pitch"));
        }
    }

    @Nested
    @DisplayName("GET /campsites/lots/{lotId}")
    class GetLotById {

        @Test
        @DisplayName("Given lot exists, When I get lot by ID, Then lot details returned")
        void shouldReturnLotDetails() throws Exception {
            // When
            result = mockMvc.perform(get("/campsites/lots/{lotId}", testLot.getId()));

            // Then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Test Pitch"))
                    .andExpect(jsonPath("$.lotType").value("TENT"))
                    .andExpect(jsonPath("$.maxGuests").value(4));
        }
    }
}
