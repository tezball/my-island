package com.myisland.api.shared.email;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailService")
class EmailServiceTest {

    @Mock
    private EmailSender emailSender;

    @Mock
    private EmailTemplateRenderer templateRenderer;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(emailSender, templateRenderer);
    }

    @Nested
    @DisplayName("sendWelcomeEmail")
    class SendWelcomeEmail {

        @Test
        @DisplayName("should send welcome email to new user")
        void shouldSendWelcomeEmail() {
            // Given
            String toEmail = "guest@example.com";
            String userName = "John Murphy";
            given(templateRenderer.render(eq("welcome"), any(Context.class)))
                    .willReturn("<html>Welcome John Murphy!</html>");

            // When
            emailService.sendWelcomeEmail(toEmail, userName);

            // Then
            verify(emailSender).send(eq(toEmail), eq("Welcome to My Island!"), eq("<html>Welcome John Murphy!</html>"));
            verify(templateRenderer).render(eq("welcome"), any(Context.class));
        }

        @Test
        @DisplayName("should use correct template variables")
        void shouldUseCorrectTemplateVariables() {
            // Given
            String toEmail = "guest@example.com";
            String userName = "John Murphy";
            ArgumentCaptor<Context> contextCaptor = ArgumentCaptor.forClass(Context.class);
            given(templateRenderer.render(eq("welcome"), any(Context.class)))
                    .willReturn("<html>Welcome!</html>");

            // When
            emailService.sendWelcomeEmail(toEmail, userName);

            // Then
            verify(templateRenderer).render(eq("welcome"), contextCaptor.capture());
            Context context = contextCaptor.getValue();
            assertThat(context.getVariable("userName")).isEqualTo("John Murphy");
        }
    }

    @Nested
    @DisplayName("sendBookingCreatedToOwner")
    class SendBookingCreatedToOwner {

        @Test
        @DisplayName("should send new booking notification to owner")
        void shouldSendNewBookingNotificationToOwner() {
            // Given
            String ownerEmail = "owner@campsite.ie";
            BookingEmailData bookingData = createSampleBookingData();
            given(templateRenderer.render(eq("booking-created-owner"), any(Context.class)))
                    .willReturn("<html>New booking!</html>");

            // When
            emailService.sendBookingCreatedToOwner(ownerEmail, bookingData);

            // Then
            verify(emailSender).send(eq(ownerEmail), contains("New Booking Request"), eq("<html>New booking!</html>"));
            verify(templateRenderer).render(eq("booking-created-owner"), any(Context.class));
        }

        @Test
        @DisplayName("should include booking details in template context")
        void shouldIncludeBookingDetailsInContext() {
            // Given
            String ownerEmail = "owner@campsite.ie";
            BookingEmailData bookingData = createSampleBookingData();
            ArgumentCaptor<Context> contextCaptor = ArgumentCaptor.forClass(Context.class);
            given(templateRenderer.render(eq("booking-created-owner"), any(Context.class)))
                    .willReturn("<html>New booking!</html>");

            // When
            emailService.sendBookingCreatedToOwner(ownerEmail, bookingData);

            // Then
            verify(templateRenderer).render(eq("booking-created-owner"), contextCaptor.capture());
            Context context = contextCaptor.getValue();
            assertThat(context.getVariable("guestName")).isEqualTo("John Murphy");
            assertThat(context.getVariable("lotName")).isEqualTo("Riverside Pitch");
            assertThat(context.getVariable("checkInDate")).isEqualTo(LocalDate.of(2026, 3, 15));
            assertThat(context.getVariable("checkOutDate")).isEqualTo(LocalDate.of(2026, 3, 18));
            assertThat(context.getVariable("totalPrice")).isEqualTo(BigDecimal.valueOf(150));
        }
    }

    @Nested
    @DisplayName("sendBookingCreatedToGuest")
    class SendBookingCreatedToGuest {

        @Test
        @DisplayName("should send booking confirmation to guest")
        void shouldSendBookingConfirmationToGuest() {
            // Given
            String guestEmail = "guest@example.com";
            BookingEmailData bookingData = createSampleBookingData();
            given(templateRenderer.render(eq("booking-created-guest"), any(Context.class)))
                    .willReturn("<html>Booking received!</html>");

            // When
            emailService.sendBookingCreatedToGuest(guestEmail, bookingData);

            // Then
            verify(emailSender).send(eq(guestEmail), contains("Booking Request Received"), eq("<html>Booking received!</html>"));
            verify(templateRenderer).render(eq("booking-created-guest"), any(Context.class));
        }
    }

    @Nested
    @DisplayName("sendBookingConfirmedToGuest")
    class SendBookingConfirmedToGuest {

        @Test
        @DisplayName("should send confirmation email to guest when booking is confirmed")
        void shouldSendConfirmationEmail() {
            // Given
            String guestEmail = "guest@example.com";
            BookingEmailData bookingData = createSampleBookingData();
            given(templateRenderer.render(eq("booking-confirmed"), any(Context.class)))
                    .willReturn("<html>Booking confirmed!</html>");

            // When
            emailService.sendBookingConfirmedToGuest(guestEmail, bookingData);

            // Then
            verify(emailSender).send(eq(guestEmail), contains("Booking Confirmed"), eq("<html>Booking confirmed!</html>"));
            verify(templateRenderer).render(eq("booking-confirmed"), any(Context.class));
        }
    }

    @Nested
    @DisplayName("sendBookingCancelledToOwner")
    class SendBookingCancelledToOwner {

        @Test
        @DisplayName("should send cancellation notification to owner")
        void shouldSendCancellationNotificationToOwner() {
            // Given
            String ownerEmail = "owner@campsite.ie";
            BookingEmailData bookingData = createSampleBookingData();
            given(templateRenderer.render(eq("booking-cancelled-owner"), any(Context.class)))
                    .willReturn("<html>Booking cancelled!</html>");

            // When
            emailService.sendBookingCancelledToOwner(ownerEmail, bookingData);

            // Then
            verify(emailSender).send(eq(ownerEmail), contains("Booking Cancelled"), eq("<html>Booking cancelled!</html>"));
            verify(templateRenderer).render(eq("booking-cancelled-owner"), any(Context.class));
        }
    }

    @Nested
    @DisplayName("sendBookingCancelledToGuest")
    class SendBookingCancelledToGuest {

        @Test
        @DisplayName("should send cancellation confirmation to guest")
        void shouldSendCancellationConfirmationToGuest() {
            // Given
            String guestEmail = "guest@example.com";
            BookingEmailData bookingData = createSampleBookingData();
            given(templateRenderer.render(eq("booking-cancelled-guest"), any(Context.class)))
                    .willReturn("<html>Booking cancelled!</html>");

            // When
            emailService.sendBookingCancelledToGuest(guestEmail, bookingData);

            // Then
            verify(emailSender).send(eq(guestEmail), contains("Booking Cancelled"), eq("<html>Booking cancelled!</html>"));
            verify(templateRenderer).render(eq("booking-cancelled-guest"), any(Context.class));
        }
    }

    @Nested
    @DisplayName("sendOfferClaimedToSupplier")
    class SendOfferClaimedToSupplier {

        @Test
        @DisplayName("should send claim notification to supplier")
        void shouldSendClaimNotificationToSupplier() {
            // Given
            String supplierEmail = "supplier@greenacres.ie";
            OfferClaimEmailData claimData = createSampleClaimData();
            given(templateRenderer.render(eq("offer-claimed-supplier"), any(Context.class)))
                    .willReturn("<html>New claim!</html>");

            // When
            emailService.sendOfferClaimedToSupplier(supplierEmail, claimData);

            // Then
            verify(emailSender).send(eq(supplierEmail), contains("New Offer Claim"), eq("<html>New claim!</html>"));
            verify(templateRenderer).render(eq("offer-claimed-supplier"), any(Context.class));
        }
    }

    @Nested
    @DisplayName("sendVoucherToGuest")
    class SendVoucherToGuest {

        @Test
        @DisplayName("should send voucher email to guest")
        void shouldSendVoucherEmailToGuest() {
            // Given
            String guestEmail = "guest@example.com";
            OfferClaimEmailData claimData = createSampleClaimData();
            given(templateRenderer.render(eq("voucher"), any(Context.class)))
                    .willReturn("<html>Your voucher!</html>");

            // When
            emailService.sendVoucherToGuest(guestEmail, claimData);

            // Then
            verify(emailSender).send(eq(guestEmail), contains("Your Voucher"), eq("<html>Your voucher!</html>"));
            verify(templateRenderer).render(eq("voucher"), any(Context.class));
        }

        @Test
        @DisplayName("should include voucher code in template context")
        void shouldIncludeVoucherCodeInContext() {
            // Given
            String guestEmail = "guest@example.com";
            OfferClaimEmailData claimData = createSampleClaimData();
            ArgumentCaptor<Context> contextCaptor = ArgumentCaptor.forClass(Context.class);
            given(templateRenderer.render(eq("voucher"), any(Context.class)))
                    .willReturn("<html>Your voucher!</html>");

            // When
            emailService.sendVoucherToGuest(guestEmail, claimData);

            // Then
            verify(templateRenderer).render(eq("voucher"), contextCaptor.capture());
            Context context = contextCaptor.getValue();
            assertThat(context.getVariable("claimCode")).isEqualTo("ABC123XYZ");
            assertThat(context.getVariable("offerTitle")).isEqualTo("10% off Farm Shop");
            assertThat(context.getVariable("supplierName")).isEqualTo("Green Acres Farm Shop");
        }
    }

    @Nested
    @DisplayName("error handling")
    class ErrorHandling {

        @Test
        @DisplayName("should log error but not throw when email fails")
        void shouldLogErrorButNotThrowWhenEmailFails() {
            // Given
            String toEmail = "guest@example.com";
            String userName = "John";
            given(templateRenderer.render(eq("welcome"), any(Context.class)))
                    .willReturn("<html>Welcome!</html>");
            doThrow(new RuntimeException("SMTP error")).when(emailSender).send(any(), any(), any());

            // When / Then - should not throw
            emailService.sendWelcomeEmail(toEmail, userName);

            verify(emailSender).send(any(), any(), any());
        }
    }

    private BookingEmailData createSampleBookingData() {
        return new BookingEmailData(
                1L,
                "John Murphy",
                "guest@example.com",
                "Riverside Pitch",
                "Nore Valley Park",
                LocalDate.of(2026, 3, 15),
                LocalDate.of(2026, 3, 18),
                2,
                BigDecimal.valueOf(150)
        );
    }

    private OfferClaimEmailData createSampleClaimData() {
        return new OfferClaimEmailData(
                1L,
                "10% off Farm Shop",
                "Green Acres Farm Shop",
                "John Murphy",
                "guest@example.com",
                "ABC123XYZ"
        );
    }
}
