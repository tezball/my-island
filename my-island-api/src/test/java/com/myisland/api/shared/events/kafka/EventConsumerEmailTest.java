package com.myisland.api.shared.events.kafka;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.email.BookingEmailData;
import com.myisland.api.shared.email.EmailNotificationService;
import com.myisland.api.shared.email.OfferClaimEmailData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EventConsumer Email Integration")
class EventConsumerEmailTest {

    @Mock
    private EmailNotificationService emailService;

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private SupplierRepository supplierRepository;

    private EventConsumer eventConsumer;

    @BeforeEach
    void setUp() {
        eventConsumer = new EventConsumer(emailService, ownerRepository, supplierRepository);
    }

    @Nested
    @DisplayName("handleBookingCreated")
    class HandleBookingCreated {

        @Test
        @DisplayName("should send email to owner when booking is created")
        void shouldSendEmailToOwner() {
            // Given
            KafkaBookingEvent event = createBookingEvent("PENDING_PAYMENT");
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            // When
            eventConsumer.handleBookingCreated(event);

            // Then
            verify(emailService).sendBookingCreatedToOwner(eq("owner@campsite.ie"), any(BookingEmailData.class));
        }

        @Test
        @DisplayName("should send email to guest when booking is created")
        void shouldSendEmailToGuest() {
            // Given
            KafkaBookingEvent event = createBookingEvent("PENDING_PAYMENT");
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            // When
            eventConsumer.handleBookingCreated(event);

            // Then
            verify(emailService).sendBookingCreatedToGuest(eq("guest@example.com"), any(BookingEmailData.class));
        }

        @Test
        @DisplayName("should include correct booking data in email")
        void shouldIncludeCorrectBookingData() {
            // Given
            KafkaBookingEvent event = createBookingEvent("PENDING_PAYMENT");
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));
            ArgumentCaptor<BookingEmailData> dataCaptor = ArgumentCaptor.forClass(BookingEmailData.class);

            // When
            eventConsumer.handleBookingCreated(event);

            // Then
            verify(emailService).sendBookingCreatedToOwner(any(), dataCaptor.capture());
            BookingEmailData data = dataCaptor.getValue();
            assertThat(data.guestName()).isEqualTo("John Murphy");
            assertThat(data.lotName()).isEqualTo("Riverside Pitch");
            assertThat(data.propertyName()).isEqualTo("Nore Valley Park");
            assertThat(data.checkInDate()).isEqualTo(LocalDate.of(2026, 3, 15));
            assertThat(data.totalPrice()).isEqualTo(BigDecimal.valueOf(150));
        }
    }

    @Nested
    @DisplayName("handleBookingConfirmed")
    class HandleBookingConfirmed {

        @Test
        @DisplayName("should send confirmation email to guest")
        void shouldSendConfirmationEmailToGuest() {
            // Given
            KafkaBookingEvent event = createBookingEvent("CONFIRMED");

            // When
            eventConsumer.handleBookingConfirmed(event);

            // Then
            verify(emailService).sendBookingConfirmedToGuest(eq("guest@example.com"), any(BookingEmailData.class));
        }
    }

    @Nested
    @DisplayName("handleBookingCancelled")
    class HandleBookingCancelled {

        @Test
        @DisplayName("should send cancellation email to owner")
        void shouldSendCancellationEmailToOwner() {
            // Given
            KafkaBookingEvent event = createBookingEvent("CANCELLED");
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            // When
            eventConsumer.handleBookingCancelled(event);

            // Then
            verify(emailService).sendBookingCancelledToOwner(eq("owner@campsite.ie"), any(BookingEmailData.class));
        }

        @Test
        @DisplayName("should send cancellation email to guest")
        void shouldSendCancellationEmailToGuest() {
            // Given
            KafkaBookingEvent event = createBookingEvent("CANCELLED");
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            // When
            eventConsumer.handleBookingCancelled(event);

            // Then
            verify(emailService).sendBookingCancelledToGuest(eq("guest@example.com"), any(BookingEmailData.class));
        }
    }

    @Nested
    @DisplayName("handleOfferClaimed")
    class HandleOfferClaimed {

        @Test
        @DisplayName("should send notification to supplier")
        void shouldSendNotificationToSupplier() {
            // Given
            KafkaOfferEvent event = createOfferEvent(false);
            Supplier supplier = createMockSupplier("supplier@greenacres.ie");
            given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));

            // When
            eventConsumer.handleOfferClaimed(event);

            // Then
            verify(emailService).sendOfferClaimedToSupplier(eq("supplier@greenacres.ie"), any(OfferClaimEmailData.class));
        }

        @Test
        @DisplayName("should send voucher to guest")
        void shouldSendVoucherToGuest() {
            // Given
            KafkaOfferEvent event = createOfferEvent(false);
            Supplier supplier = createMockSupplier("supplier@greenacres.ie");
            given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));

            // When
            eventConsumer.handleOfferClaimed(event);

            // Then
            verify(emailService).sendVoucherToGuest(eq("guest@example.com"), any(OfferClaimEmailData.class));
        }

        @Test
        @DisplayName("should not send emails for test claims")
        void shouldNotSendEmailsForTestClaims() {
            // Given
            KafkaOfferEvent event = createOfferEvent(true);

            // When
            eventConsumer.handleOfferClaimed(event);

            // Then
            verifyNoInteractions(emailService);
        }

        @Test
        @DisplayName("should include correct claim data in email")
        void shouldIncludeCorrectClaimData() {
            // Given
            KafkaOfferEvent event = createOfferEvent(false);
            Supplier supplier = createMockSupplier("supplier@greenacres.ie");
            given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));
            ArgumentCaptor<OfferClaimEmailData> dataCaptor = ArgumentCaptor.forClass(OfferClaimEmailData.class);

            // When
            eventConsumer.handleOfferClaimed(event);

            // Then
            verify(emailService).sendVoucherToGuest(any(), dataCaptor.capture());
            OfferClaimEmailData data = dataCaptor.getValue();
            assertThat(data.claimCode()).isEqualTo("ABC123XYZ");
            assertThat(data.offerTitle()).isEqualTo("10% off Farm Shop");
            assertThat(data.supplierName()).isEqualTo("Green Acres Farm Shop");
        }
    }

    @Nested
    @DisplayName("handleUserRegistered")
    class HandleUserRegistered {

        @Test
        @DisplayName("should send welcome email to new user")
        void shouldSendWelcomeEmail() {
            // Given
            KafkaUserEvent event = new KafkaUserEvent(
                    1L,
                    "newuser@example.com",
                    "New User",
                    "GUEST",
                    LocalDateTime.now()
            );

            // When
            eventConsumer.handleUserRegistered(event);

            // Then
            verify(emailService).sendWelcomeEmail("newuser@example.com", "New User");
        }
    }

    private KafkaBookingEvent createBookingEvent(String status) {
        return new KafkaBookingEvent(
                1L,
                1L,
                "John Murphy",
                "guest@example.com",
                1L,
                "Riverside Pitch",
                1L,
                "Nore Valley Park",
                LocalDate.of(2026, 3, 15),
                LocalDate.of(2026, 3, 18),
                2,
                BigDecimal.valueOf(150),
                status,
                LocalDateTime.now()
        );
    }

    private KafkaOfferEvent createOfferEvent(boolean isTest) {
        return new KafkaOfferEvent(
                1L,
                1L,
                "10% off Farm Shop",
                1L,
                "Green Acres Farm Shop",
                1L,
                "John Murphy",
                "guest@example.com",
                "ABC123XYZ",
                "CLAIMED",
                isTest,
                LocalDateTime.now()
        );
    }

    private Owner createMockOwner(String email) {
        User user = mock(User.class);
        given(user.getEmail()).willReturn(email);
        Owner owner = mock(Owner.class);
        given(owner.getUser()).willReturn(user);
        return owner;
    }

    private Supplier createMockSupplier(String email) {
        User user = mock(User.class);
        given(user.getEmail()).willReturn(email);
        Supplier supplier = mock(Supplier.class);
        given(supplier.getUser()).willReturn(user);
        return supplier;
    }
}
