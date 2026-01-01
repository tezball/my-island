import { Routes, Route } from 'react-router-dom'

// Auth Pages
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PasswordResetSentPage from './pages/PasswordResetSentPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import AccountLockedPage from './pages/AccountLockedPage'
import AccountSuspendedPage from './pages/AccountSuspendedPage'
import UnverifiedEmailPage from './pages/UnverifiedEmailPage'
import EmailVerifiedPage from './pages/EmailVerifiedPage'
import EmailExistsPage from './pages/EmailExistsPage'
import SetNewPasswordPage from './pages/SetNewPasswordPage'
import PasswordResetSuccessPage from './pages/PasswordResetSuccessPage'
import TokenExpiredPage from './pages/TokenExpiredPage'
import ResetEmailNotFoundPage from './pages/ResetEmailNotFoundPage'
import SessionExpiredPage from './pages/SessionExpiredPage'
import VerificationExpiredPage from './pages/VerificationExpiredPage'
import SSOAuthPage from './pages/SSOAuthPage'

// Onboarding Pages
import WelcomePage from './pages/WelcomePage'
import OnboardingPage from './pages/OnboardingPage'

// Error Pages
import NetworkErrorPage from './pages/NetworkErrorPage'
import ServerErrorPage from './pages/ServerErrorPage'
import NotFoundPage from './pages/NotFoundPage'
import MaintenancePage from './pages/MaintenancePage'

// Discovery Pages
import DiscoverPage from './pages/DiscoverPage'
import SearchPage from './pages/SearchPage'
import CampsiteDetailPage from './pages/CampsiteDetailPage'
import PhotoGalleryPage from './pages/PhotoGalleryPage'

// Booking Pages
import BookingPage from './pages/BookingPage'
import BookingPaymentPage from './pages/BookingPaymentPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import LotCalendarPage from './pages/LotCalendarPage'
import PaymentFailedPage from './pages/PaymentFailedPage'
import BookingFailedPage from './pages/BookingFailedPage'
import SelectDatesPage from './pages/SelectDatesPage'
import GuestExtrasPage from './pages/GuestExtrasPage'
import PaymentProcessingPage from './pages/PaymentProcessingPage'
import PaymentMethodsPage from './pages/PaymentMethodsPage'
import AddPaymentMethodPage from './pages/AddPaymentMethodPage'

// My Bookings Pages
import MyBookingsPage from './pages/MyBookingsPage'
import BookingDetailPage from './pages/BookingDetailPage'
import ModifyDatesPage from './pages/ModifyDatesPage'
import ModifyGuestsPage from './pages/ModifyGuestsPage'
import CheckInInstructionsPage from './pages/CheckInInstructionsPage'
import ContactHostPage from './pages/ContactHostPage'
import ModifySummaryPage from './pages/ModifySummaryPage'
import CancelConfirmPage from './pages/CancelConfirmPage'
import CancellationSuccessPage from './pages/CancellationSuccessPage'
import BookingReceiptPage from './pages/BookingReceiptPage'

// Profile & Settings Pages
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import ProfileEditPage from './pages/ProfileEditPage'
import PersonalInfoPage from './pages/PersonalInfoPage'
import LinkedAccountsPage from './pages/LinkedAccountsPage'
import SettingsPage from './pages/SettingsPage'

// Support Pages
import SupportPage from './pages/SupportPage'
import FAQPage from './pages/FAQPage'
import ContactSupportPage from './pages/ContactSupportPage'
import SupportTicketsPage from './pages/SupportTicketsPage'

// Notification Pages
import NotificationsPage from './pages/NotificationsPage'
import NotificationSettingsPage from './pages/NotificationSettingsPage'
import NotificationCenterPage from './pages/NotificationCenterPage'
import NotificationDetailPage from './pages/NotificationDetailPage'

// Reviews & Offers Pages
import ReviewsPage from './pages/ReviewsPage'
import WriteReviewPage from './pages/WriteReviewPage'
import OffersPage from './pages/OffersPage'
import SupplierDetailPage from './pages/SupplierDetailPage'

// Owner Admin Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'
import OwnerStatsPage from './pages/owner/OwnerStatsPage'
import ManageLotsPage from './pages/owner/ManageLotsPage'
import LotFormPage from './pages/owner/LotFormPage'
import CampsiteFormPage from './pages/owner/CampsiteFormPage'
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage'
import OfferManagementPage from './pages/owner/OfferManagementPage'
import RevenueDashboardPage from './pages/owner/RevenueDashboardPage'
import OwnerSettingsPage from './pages/owner/OwnerSettingsPage'

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/password-reset-sent" element={<PasswordResetSentPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/account-locked" element={<AccountLockedPage />} />
      <Route path="/account-suspended" element={<AccountSuspendedPage />} />
      <Route path="/unverified-email" element={<UnverifiedEmailPage />} />
      <Route path="/email-verified" element={<EmailVerifiedPage />} />
      <Route path="/email-exists" element={<EmailExistsPage />} />
      <Route path="/reset-password" element={<SetNewPasswordPage />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
      <Route path="/token-expired" element={<TokenExpiredPage />} />
      <Route path="/reset-email-not-found" element={<ResetEmailNotFoundPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      <Route path="/verification-expired" element={<VerificationExpiredPage />} />
      <Route path="/auth/:provider" element={<SSOAuthPage />} />

      {/* Onboarding */}
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Error Pages */}
      <Route path="/network-error" element={<NetworkErrorPage />} />
      <Route path="/server-error" element={<ServerErrorPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />

      {/* Main App Routes */}
      <Route path="/" element={<DiscoverPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/campsite/:id" element={<CampsiteDetailPage />} />
      <Route path="/campsite/:id/photos" element={<PhotoGalleryPage />} />
      <Route path="/campsite/:id/reviews" element={<ReviewsPage />} />
      <Route path="/campsite/:id/review" element={<WriteReviewPage />} />

      {/* Booking Flow */}
      <Route path="/book/:id" element={<BookingPage />} />
      <Route path="/book/:id/dates" element={<SelectDatesPage />} />
      <Route path="/book/:id/calendar" element={<LotCalendarPage />} />
      <Route path="/book/:id/guests" element={<GuestExtrasPage />} />
      <Route path="/book/:id/payment" element={<BookingPaymentPage />} />
      <Route path="/book/:id/processing" element={<PaymentProcessingPage />} />
      <Route path="/book/:id/confirmation" element={<BookingConfirmationPage />} />
      <Route path="/book/:id/payment-failed" element={<PaymentFailedPage />} />
      <Route path="/book/:id/booking-failed" element={<BookingFailedPage />} />
      <Route path="/payment-methods" element={<PaymentMethodsPage />} />
      <Route path="/payment-methods/add" element={<AddPaymentMethodPage />} />

      {/* My Bookings */}
      <Route path="/bookings" element={<MyBookingsPage />} />
      <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />
      <Route path="/bookings/:bookingId/modify-dates" element={<ModifyDatesPage />} />
      <Route path="/bookings/:bookingId/modify-guests" element={<ModifyGuestsPage />} />
      <Route path="/bookings/:bookingId/modify-summary" element={<ModifySummaryPage />} />
      <Route path="/bookings/:bookingId/cancel" element={<CancelConfirmPage />} />
      <Route path="/bookings/:bookingId/cancelled" element={<CancellationSuccessPage />} />
      <Route path="/bookings/:bookingId/receipt" element={<BookingReceiptPage />} />
      <Route path="/bookings/:bookingId/check-in" element={<CheckInInstructionsPage />} />
      <Route path="/bookings/:bookingId/contact-host" element={<ContactHostPage />} />

      {/* Favorites */}
      <Route path="/favorites" element={<FavoritesPage />} />

      {/* Offers */}
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/offers/:id" element={<SupplierDetailPage />} />

      {/* Profile */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/profile/personal-info" element={<PersonalInfoPage />} />
      <Route path="/profile/linked-accounts" element={<LinkedAccountsPage />} />
      <Route path="/profile/notifications" element={<NotificationSettingsPage />} />

      {/* Settings */}
      <Route path="/settings" element={<SettingsPage />} />

      {/* Support */}
      <Route path="/support" element={<SupportPage />} />
      <Route path="/support/faq" element={<FAQPage />} />
      <Route path="/support/contact" element={<ContactSupportPage />} />
      <Route path="/support/tickets" element={<SupportTicketsPage />} />

      {/* Notifications */}
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/center" element={<NotificationCenterPage />} />
      <Route path="/notifications/:id" element={<NotificationDetailPage />} />

      {/* Owner Admin */}
      <Route path="/owner" element={<OwnerDashboardPage />} />
      <Route path="/owner/stats" element={<OwnerStatsPage />} />
      <Route path="/owner/lots" element={<ManageLotsPage />} />
      <Route path="/owner/lots/new" element={<LotFormPage />} />
      <Route path="/owner/lots/:lotId/edit" element={<LotFormPage />} />
      <Route path="/owner/campsites/:id/edit" element={<CampsiteFormPage />} />
      <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
      <Route path="/owner/offers" element={<OfferManagementPage />} />
      <Route path="/owner/revenue" element={<RevenueDashboardPage />} />
      <Route path="/owner/settings" element={<OwnerSettingsPage />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
