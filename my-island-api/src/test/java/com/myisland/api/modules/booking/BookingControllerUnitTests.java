package com.myisland.api.modules.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myisland.api.modules.booking.controller.BookingController;
import com.myisland.api.modules.booking.dto.BookingDto;
import com.myisland.api.modules.booking.service.BookingService;
import com.myisland.api.security.CustomUserDetails;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
@Import({ BookingControllerUnitTests.SecurityConfig.class, com.myisland.api.security.JwtAuthenticationFilter.class })
public class BookingControllerUnitTests {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private BookingService bookingService;

        @MockBean
        private com.myisland.api.modules.booking.service.BookingPaymentService bookingPaymentService;

        @MockBean
        private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

        // JwtAuthenticationFilter is now a real bean (imported), so we mock its
        // dependency
        @MockBean
        private com.myisland.api.security.JwtProvider jwtProvider;

        // Minimal security config to avoid loading full security chain if needed,
        // or we can rely on @WebMvcTest auto-config for security.
        // However, since we use @AuthenticationPrincipal, we need the user to be
        // injected.
        // We will use SecurityMockMvcRequestPostProcessors.user()

        @Test
        @DisplayName("should confirm booking when authenticated")
        void shouldConfirmBooking() throws Exception {
                Long bookingId = 1L;
                Long userId = 100L;

                BookingDto mockBooking = new BookingDto(
                                bookingId,
                                userId,
                                "Test User",
                                10L,
                                "Test Lot",
                                "Test Campsite",
                                java.time.LocalDate.now(),
                                java.time.LocalDate.now().plusDays(2),
                                2,
                                java.math.BigDecimal.valueOf(100),
                                java.math.BigDecimal.valueOf(10),
                                java.math.BigDecimal.valueOf(110),
                                "CONFIRMED",
                                "PAID",
                                "Special Request",
                                java.time.LocalDateTime.now(),
                                null, null, null, null);
                given(bookingService.confirmBooking(eq(bookingId), eq(userId))).willReturn(mockBooking);

                CustomUserDetails userDetails = new CustomUserDetails(
                                userId, "test@example.com", "password", java.util.Collections.emptyList());

                mockMvc.perform(put("/bookings/{id}/confirm", bookingId)
                                .with(user(userDetails))
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk());

                verify(bookingService).confirmBooking(eq(bookingId), eq(userId));
        }

        @Test
        @DisplayName("should deny confirmation when service throws exception")
        void shouldDenyConfirmation() throws Exception {
                Long bookingId = 1L;
                Long userId = 101L; // Non-owner

                given(bookingService.confirmBooking(eq(bookingId), eq(userId)))
                                .willThrow(new com.myisland.api.shared.exceptions.BadRequestException(
                                                "Not authorized"));

                CustomUserDetails userDetails = new CustomUserDetails(
                                userId, "test@example.com", "password", java.util.Collections.emptyList());

                mockMvc.perform(put("/bookings/{id}/confirm", bookingId)
                                .with(user(userDetails))
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isBadRequest());
        }

        // Inner configuration class to help with security imports if needed,
        // but usually user(userDetails) is enough for simple controller tests.
        static class SecurityConfig {
        }
}
