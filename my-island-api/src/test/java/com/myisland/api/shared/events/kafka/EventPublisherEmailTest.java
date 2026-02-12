package com.myisland.api.shared.events.kafka;

import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.marketplace.entity.Offer;
import com.myisland.api.modules.marketplace.entity.OfferClaim;
import com.myisland.api.modules.marketplace.entity.Supplier;
import com.myisland.api.modules.marketplace.repository.OfferClaimRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.shared.email.BookingEmailData;
import com.myisland.api.shared.email.EmailNotificationService;
import com.myisland.api.shared.email.OfferClaimEmailData;
import com.myisland.api.shared.events.BookingEvent;
import com.myisland.api.shared.events.OfferEvent;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EventPublisher Email Integration")
class EventPublisherEmailTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private OfferClaimRepository offerClaimRepository;

    @Mock
    private EmailNotificationService emailService;

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private SupplierRepository supplierRepository;

    private EventPublisher eventPublisher;

    @BeforeEach
    void setUp() {
        eventPublisher = new EventPublisher(
                bookingRepository, offerClaimRepository,
                emailService, ownerRepository, supplierRepository);
    }

    @Nested
    @DisplayName("handleBookingEvent — CREATED")
    class HandleBookingCreated {

        @Test
        @DisplayName("should send email to owner when booking is created")
        void shouldSendEmailToOwner() {
            Booking booking = createMockBooking();
            given(bookingRepository.findByIdWithDetails(1L)).willReturn(Optional.of(booking));
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            eventPublisher.handleBookingEvent(new BookingEvent(this, 1L, BookingEvent.Type.CREATED));

            verify(emailService).sendBookingCreatedToOwner(eq("owner@campsite.ie"), any(BookingEmailData.class));
        }

        @Test
        @DisplayName("should send email to guest when booking is created")
        void shouldSendEmailToGuest() {
            Booking booking = createMockBooking();
            given(bookingRepository.findByIdWithDetails(1L)).willReturn(Optional.of(booking));
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            eventPublisher.handleBookingEvent(new BookingEvent(this, 1L, BookingEvent.Type.CREATED));

            verify(emailService).sendBookingCreatedToGuest(eq("guest@example.com"), any(BookingEmailData.class));
        }

        @Test
        @DisplayName("should include correct booking data in email")
        void shouldIncludeCorrectBookingData() {
            Booking booking = createMockBooking();
            given(bookingRepository.findByIdWithDetails(1L)).willReturn(Optional.of(booking));
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));
            ArgumentCaptor<BookingEmailData> dataCaptor = ArgumentCaptor.forClass(BookingEmailData.class);

            eventPublisher.handleBookingEvent(new BookingEvent(this, 1L, BookingEvent.Type.CREATED));

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
    @DisplayName("handleBookingEvent — CONFIRMED")
    class HandleBookingConfirmed {

        @Test
        @DisplayName("should send confirmation email to guest")
        void shouldSendConfirmationEmailToGuest() {
            Booking booking = createMockBooking();
            given(bookingRepository.findByIdWithDetails(1L)).willReturn(Optional.of(booking));

            eventPublisher.handleBookingEvent(new BookingEvent(this, 1L, BookingEvent.Type.CONFIRMED));

            verify(emailService).sendBookingConfirmedToGuest(eq("guest@example.com"), any(BookingEmailData.class));
        }
    }

    @Nested
    @DisplayName("handleBookingEvent — CANCELLED")
    class HandleBookingCancelled {

        @Test
        @DisplayName("should send cancellation email to owner")
        void shouldSendCancellationEmailToOwner() {
            Booking booking = createMockBooking();
            given(bookingRepository.findByIdWithDetails(1L)).willReturn(Optional.of(booking));
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            eventPublisher.handleBookingEvent(new BookingEvent(this, 1L, BookingEvent.Type.CANCELLED));

            verify(emailService).sendBookingCancelledToOwner(eq("owner@campsite.ie"), any(BookingEmailData.class));
        }

        @Test
        @DisplayName("should send cancellation email to guest")
        void shouldSendCancellationEmailToGuest() {
            Booking booking = createMockBooking();
            given(bookingRepository.findByIdWithDetails(1L)).willReturn(Optional.of(booking));
            Owner owner = createMockOwner("owner@campsite.ie");
            given(ownerRepository.findById(1L)).willReturn(Optional.of(owner));

            eventPublisher.handleBookingEvent(new BookingEvent(this, 1L, BookingEvent.Type.CANCELLED));

            verify(emailService).sendBookingCancelledToGuest(eq("guest@example.com"), any(BookingEmailData.class));
        }
    }

    @Nested
    @DisplayName("handleOfferEvent — CLAIMED")
    class HandleOfferClaimed {

        @Test
        @DisplayName("should send notification to supplier")
        void shouldSendNotificationToSupplier() {
            OfferClaim claim = createMockClaim(false);
            given(offerClaimRepository.findByIdWithDetails(1L)).willReturn(Optional.of(claim));
            Supplier supplier = createMockSupplier("supplier@greenacres.ie");
            given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));

            eventPublisher.handleOfferEvent(new OfferEvent(this, 1L, OfferEvent.Type.CLAIMED));

            verify(emailService).sendOfferClaimedToSupplier(eq("supplier@greenacres.ie"), any(OfferClaimEmailData.class));
        }

        @Test
        @DisplayName("should send voucher to guest")
        void shouldSendVoucherToGuest() {
            OfferClaim claim = createMockClaim(false);
            given(offerClaimRepository.findByIdWithDetails(1L)).willReturn(Optional.of(claim));
            Supplier supplier = createMockSupplier("supplier@greenacres.ie");
            given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));

            eventPublisher.handleOfferEvent(new OfferEvent(this, 1L, OfferEvent.Type.CLAIMED));

            verify(emailService).sendVoucherToGuest(eq("guest@example.com"), any(OfferClaimEmailData.class));
        }

        @Test
        @DisplayName("should not send emails for test claims")
        void shouldNotSendEmailsForTestClaims() {
            OfferClaim claim = createMockClaim(true);
            given(offerClaimRepository.findByIdWithDetails(1L)).willReturn(Optional.of(claim));

            eventPublisher.handleOfferEvent(new OfferEvent(this, 1L, OfferEvent.Type.CLAIMED));

            verifyNoInteractions(emailService);
        }

        @Test
        @DisplayName("should include correct claim data in email")
        void shouldIncludeCorrectClaimData() {
            OfferClaim claim = createMockClaim(false);
            given(offerClaimRepository.findByIdWithDetails(1L)).willReturn(Optional.of(claim));
            Supplier supplier = createMockSupplier("supplier@greenacres.ie");
            given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));
            ArgumentCaptor<OfferClaimEmailData> dataCaptor = ArgumentCaptor.forClass(OfferClaimEmailData.class);

            eventPublisher.handleOfferEvent(new OfferEvent(this, 1L, OfferEvent.Type.CLAIMED));

            verify(emailService).sendVoucherToGuest(any(), dataCaptor.capture());
            OfferClaimEmailData data = dataCaptor.getValue();
            assertThat(data.claimCode()).isEqualTo("ABC123XYZ");
            assertThat(data.offerTitle()).isEqualTo("10% off Farm Shop");
            assertThat(data.supplierName()).isEqualTo("Green Acres Farm Shop");
        }
    }

    private Booking createMockBooking() {
        User guest = mock(User.class);
        lenient().when(guest.getName()).thenReturn("John Murphy");
        lenient().when(guest.getEmail()).thenReturn("guest@example.com");

        Owner owner = mock(Owner.class);
        lenient().when(owner.getId()).thenReturn(1L);
        lenient().when(owner.getPropertyName()).thenReturn("Nore Valley Park");

        Lot lot = mock(Lot.class);
        lenient().when(lot.getName()).thenReturn("Riverside Pitch");
        lenient().when(lot.getOwner()).thenReturn(owner);

        Booking booking = mock(Booking.class);
        lenient().when(booking.getId()).thenReturn(1L);
        lenient().when(booking.getUser()).thenReturn(guest);
        lenient().when(booking.getLot()).thenReturn(lot);
        lenient().when(booking.getCheckInDate()).thenReturn(LocalDate.of(2026, 3, 15));
        lenient().when(booking.getCheckOutDate()).thenReturn(LocalDate.of(2026, 3, 18));
        lenient().when(booking.getNumGuests()).thenReturn(2);
        lenient().when(booking.getTotalPrice()).thenReturn(BigDecimal.valueOf(150));

        return booking;
    }

    private OfferClaim createMockClaim(boolean isTest) {
        User guest = mock(User.class);
        lenient().when(guest.getName()).thenReturn("John Murphy");
        lenient().when(guest.getEmail()).thenReturn("guest@example.com");

        Supplier supplier = mock(Supplier.class);
        lenient().when(supplier.getId()).thenReturn(1L);
        lenient().when(supplier.getBusinessName()).thenReturn("Green Acres Farm Shop");

        Offer offer = mock(Offer.class);
        lenient().when(offer.getTitle()).thenReturn("10% off Farm Shop");
        lenient().when(offer.getSupplier()).thenReturn(supplier);

        OfferClaim claim = mock(OfferClaim.class);
        lenient().when(claim.getId()).thenReturn(1L);
        lenient().when(claim.getUser()).thenReturn(guest);
        lenient().when(claim.getOffer()).thenReturn(offer);
        lenient().when(claim.getClaimCode()).thenReturn("ABC123XYZ");
        given(claim.isTest()).willReturn(isTest);

        return claim;
    }

    private Owner createMockOwner(String email) {
        User user = mock(User.class);
        given(user.getEmail()).willReturn(email);
        Owner owner = mock(Owner.class);
        given(owner.getUser()).willReturn(user);
        given(owner.isEmailNotificationsBookings()).willReturn(true);
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
