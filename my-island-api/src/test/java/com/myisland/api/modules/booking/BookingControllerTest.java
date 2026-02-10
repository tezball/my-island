package com.myisland.api.modules.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.dto.CreateBookingRequest;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.dto.SignupRequest;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
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

@DisplayName("Booking API")
class BookingControllerTest extends BddTest {

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private OwnerRepository ownerRepository;

        @Autowired
        private LotRepository lotRepository;

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        private Lot testLot;

        @BeforeEach
        void setUp() {
                resetScenario();
                setupTestData();
        }

        private void setupTestData() {
                // Clean up
                bookingRepository.deleteAll();
                lotRepository.deleteAll();
                ownerRepository.deleteAll();

                // Create owner user
                User ownerUser = userRepository.save(User.builder()
                                .email("bookingowner@example.com")
                                .passwordHash(passwordEncoder.encode("password"))
                                .name("Booking Owner")
                                .role(User.UserRole.OWNER)
                                .isOwner(true)
                                .build());

                // Create owner
                Owner owner = ownerRepository.save(Owner.builder()
                                .user(ownerUser)
                                .propertyName("Booking Test Campsite")
                                .county("Cork")
                                .propertyType(Owner.PropertyType.TENT)
                                .build());

                // Create lot
                testLot = lotRepository.save(Lot.builder()
                                .owner(owner)
                                .name("Booking Test Pitch")
                                .lotType(Lot.LotType.TENT)
                                .pricePerNight(BigDecimal.valueOf(30.00))
                                .maxGuests(4)
                                .isActive(true)
                                .build());
        }

        private String createUserAndGetToken(String email) throws Exception {
                var signupRequest = new SignupRequest(email, "password123", "Test Guest");
                var signupResult = mockMvc.perform(post("/auth/signup")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(signupRequest)))
                                .andReturn();

                return objectMapper.readTree(signupResult.getResponse().getContentAsString())
                                .get("token").asText();
        }

        @Nested
        @DisplayName("POST /bookings")
        class CreateBooking {

                @Test
                @DisplayName("Given valid booking request, When I create booking, Then booking is created")
                void shouldCreateBooking() throws Exception {
                        // Given
                        authToken = createUserAndGetToken("booker1@example.com");
                        var request = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(10),
                                        LocalDate.now().plusDays(13),
                                        2,
                                        "Early check-in please");

                        // When
                        result = mockMvc.perform(post("/bookings")
                                        .header("Authorization", "Bearer " + authToken)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(request)));

                        // Then
                        result.andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.lotId").value(testLot.getId()))
                                        .andExpect(jsonPath("$.numGuests").value(2))
                                        .andExpect(jsonPath("$.totalPrice").value(90.00)) // 3 nights * 30
                                        .andExpect(jsonPath("$.status").value("PENDING"))
                                        .andExpect(jsonPath("$.specialRequests").value("Early check-in please"));
                }

                @Test
                @DisplayName("Given overlapping dates, When I create booking, Then error returned")
                void shouldRejectOverlappingBooking() throws Exception {
                        // Given - Create first booking
                        authToken = createUserAndGetToken("booker2@example.com");
                        var firstRequest = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(20),
                                        LocalDate.now().plusDays(23),
                                        2,
                                        null);
                        mockMvc.perform(post("/bookings")
                                        .header("Authorization", "Bearer " + authToken)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(firstRequest)));

                        // When - Try overlapping booking
                        var overlappingRequest = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(22),
                                        LocalDate.now().plusDays(25),
                                        2,
                                        null);
                        result = mockMvc.perform(post("/bookings")
                                        .header("Authorization", "Bearer " + authToken)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(overlappingRequest)));

                        // Then
                        result.andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.message").value(containsString("not available")));
                }

                @Test
                @DisplayName("Given guests exceed capacity, When I create booking, Then error returned")
                void shouldRejectExcessGuests() throws Exception {
                        // Given
                        authToken = createUserAndGetToken("booker3@example.com");
                        var request = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(30),
                                        LocalDate.now().plusDays(32),
                                        10, // Lot max is 4
                                        null);

                        // When
                        result = mockMvc.perform(post("/bookings")
                                        .header("Authorization", "Bearer " + authToken)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(request)));

                        // Then
                        result.andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.message").value(containsString("exceeds")));
                }

                @Test
                @DisplayName("Given no auth token, When I create booking, Then unauthorized")
                void shouldRequireAuthentication() throws Exception {
                        // Given
                        var request = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(40),
                                        LocalDate.now().plusDays(42),
                                        2,
                                        null);

                        // When
                        result = mockMvc.perform(post("/bookings")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(request)));

                        // Then
                        result.andExpect(status().isUnauthorized());
                }
        }

        @Nested
        @DisplayName("GET /bookings")
        class GetUserBookings {

                @Test
                @DisplayName("Given user has bookings, When I list bookings, Then my bookings returned")
                void shouldReturnUserBookings() throws Exception {
                        // Given - Create user and booking
                        authToken = createUserAndGetToken("booker4@example.com");
                        var request = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(50),
                                        LocalDate.now().plusDays(52),
                                        2,
                                        null);
                        mockMvc.perform(post("/bookings")
                                        .header("Authorization", "Bearer " + authToken)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(request)));

                        // When
                        result = mockMvc.perform(get("/bookings")
                                        .header("Authorization", "Bearer " + authToken));

                        // Then
                        result.andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(1)))
                                        .andExpect(jsonPath("$[0].lotName").value("Booking Test Pitch"));
                }
        }

        @Nested
        @DisplayName("POST /bookings/{id}/cancel")
        class CancelBooking {

                @Test
                @DisplayName("Given pending booking, When I cancel, Then booking is cancelled")
                void shouldCancelBooking() throws Exception {
                        // Given - Create booking
                        authToken = createUserAndGetToken("booker5@example.com");
                        var request = new CreateBookingRequest(
                                        testLot.getId(),
                                        LocalDate.now().plusDays(60),
                                        LocalDate.now().plusDays(62),
                                        2,
                                        null);
                        var createResult = mockMvc.perform(post("/bookings")
                                        .header("Authorization", "Bearer " + authToken)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(request)))
                                        .andReturn();

                        Long bookingId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                                        .get("id").asLong();

                        // When
                        result = mockMvc.perform(post("/bookings/{id}/cancel", bookingId)
                                        .header("Authorization", "Bearer " + authToken));

                        // Then
                        result.andExpect(status().isOk())
                                        .andExpect(jsonPath("$.status").value("CANCELLED"));
                }
        }
}
