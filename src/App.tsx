import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'

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
import ProfilePaymentMethodsPage from './pages/ProfilePaymentMethodsPage'
import SettingsPage from './pages/SettingsPage'
import BecomeOwnerPage from './pages/BecomeOwnerPage'
import BecomeSupplierPage from './pages/BecomeSupplierPage'

// Support Pages
import SupportPage from './pages/SupportPage'
import FAQPage from './pages/FAQPage'
import ContactSupportPage from './pages/ContactSupportPage'
import SupportTicketsPage from './pages/SupportTicketsPage'
import SupportTicketDetailPage from './pages/SupportTicketDetailPage'

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
import LocalBusinessDetailPage from './pages/LocalBusinessDetailPage'

// Supplier Admin Pages
import SupplierDashboardPage from './pages/supplier/SupplierDashboardPage'
import BusinessProfilePage from './pages/supplier/BusinessProfilePage'
import SupplierOffersPage from './pages/supplier/SupplierOffersPage'

// Owner Admin Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'
import OwnerStatsPage from './pages/owner/OwnerStatsPage'
import ManageLotsPage from './pages/owner/ManageLotsPage'
import LotFormPage from './pages/owner/LotFormPage'
import CampsiteFormPage from './pages/owner/CampsiteFormPage'
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage'
import OfferManagementPage from './pages/owner/OfferManagementPage'
import OfferFormPage from './pages/owner/OfferFormPage'
import RevenueDashboardPage from './pages/owner/RevenueDashboardPage'
import OwnerSettingsPage from './pages/owner/OwnerSettingsPage'
import OwnerCalendarSettingsPage from './pages/owner/OwnerCalendarSettingsPage'
import OwnerPricingSettingsPage from './pages/owner/OwnerPricingSettingsPage'
import OwnerBankSettingsPage from './pages/owner/OwnerBankSettingsPage'
import OwnerPayoutSchedulePage from './pages/owner/OwnerPayoutSchedulePage'
import OwnerTaxSettingsPage from './pages/owner/OwnerTaxSettingsPage'
import OwnerTeamSettingsPage from './pages/owner/OwnerTeamSettingsPage'
import CampsiteCreateWizardPage from './pages/owner/CampsiteCreateWizardPage'
import PropertyWizardPage from './pages/owner/PropertyWizardPage'
import PropertyTypeSelectionPage from './pages/owner/PropertyTypeSelectionPage'
import PropertyPublishSuccessPage from './pages/owner/PropertyPublishSuccessPage'
import OwnerReviewsPage from './pages/owner/OwnerReviewsPage'
import OwnerCalendarPage from './pages/owner/OwnerCalendarPage'

// Static Pages
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

// Map Pages
import MapPage from './pages/MapPage'
import CampsiteMapPage from './pages/CampsiteMapPage'

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
      <Route path="/map" element={<MapPage />} />
      <Route path="/campsite/:id" element={<CampsiteDetailPage />} />
      <Route path="/campsite/:id/photos" element={<PhotoGalleryPage />} />
      <Route path="/campsite/:id/reviews" element={<ReviewsPage />} />
      <Route path="/campsite/:id/review" element={<WriteReviewPage />} />
      <Route path="/campsite/:id/map" element={<CampsiteMapPage />} />

      {/* Booking Flow */}
      <Route path="/book/:id" element={<BookingPage />} />
      <Route path="/book/:id/dates" element={<SelectDatesPage />} />
      <Route path="/book/:id/calendar" element={<LotCalendarPage />} />
      <Route path="/book/:id/guests" element={<GuestExtrasPage />} />
      <Route path="/book/:id/extras" element={<GuestExtrasPage />} />
      <Route path="/book/:id/payment" element={<BookingPaymentPage />} />
      <Route path="/book/:id/payment-methods" element={<PaymentMethodsPage />} />
      <Route path="/book/:id/add-payment" element={<AddPaymentMethodPage />} />
      <Route path="/book/:id/processing" element={<PaymentProcessingPage />} />
      <Route path="/book/:id/confirmation" element={<BookingConfirmationPage />} />
      <Route path="/book/:id/payment-failed" element={<PaymentFailedPage />} />
      <Route path="/book/:id/booking-failed" element={<BookingFailedPage />} />

      {/* My Bookings - Protected */}
      <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/modify-dates" element={<ProtectedRoute><ModifyDatesPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/modify-guests" element={<ProtectedRoute><ModifyGuestsPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/modify-summary" element={<ProtectedRoute><ModifySummaryPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/cancel" element={<ProtectedRoute><CancelConfirmPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/cancelled" element={<ProtectedRoute><CancellationSuccessPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/receipt" element={<ProtectedRoute><BookingReceiptPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/check-in" element={<ProtectedRoute><CheckInInstructionsPage /></ProtectedRoute>} />
      <Route path="/bookings/:bookingId/contact-host" element={<ProtectedRoute><ContactHostPage /></ProtectedRoute>} />

      {/* Favorites - Protected */}
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

      {/* Offers */}
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/offers/:id" element={<SupplierDetailPage />} />

      {/* Local Businesses (Suppliers on Map) */}
      <Route path="/supplier/:id" element={<LocalBusinessDetailPage />} />

      {/* Profile - Protected */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
      <Route path="/profile/personal-info" element={<ProtectedRoute><PersonalInfoPage /></ProtectedRoute>} />
      <Route path="/profile/linked-accounts" element={<ProtectedRoute><LinkedAccountsPage /></ProtectedRoute>} />
      <Route path="/profile/notifications" element={<ProtectedRoute><NotificationSettingsPage /></ProtectedRoute>} />
      <Route path="/payment-methods" element={<ProtectedRoute><ProfilePaymentMethodsPage /></ProtectedRoute>} />

      {/* Settings - Protected */}
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Become Owner - Protected */}
      <Route path="/become-owner" element={<ProtectedRoute><BecomeOwnerPage /></ProtectedRoute>} />

      {/* Become Supplier - Protected */}
      <Route path="/become-supplier" element={<ProtectedRoute><BecomeSupplierPage /></ProtectedRoute>} />

      {/* Support */}
      <Route path="/support" element={<SupportPage />} />
      <Route path="/support/faq" element={<FAQPage />} />
      <Route path="/support/contact" element={<ContactSupportPage />} />
      <Route path="/support/tickets" element={<SupportTicketsPage />} />
      <Route path="/support/tickets/:ticketId" element={<SupportTicketDetailPage />} />

      {/* Static Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Notifications - Protected */}
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/notifications/center" element={<ProtectedRoute><NotificationCenterPage /></ProtectedRoute>} />
      <Route path="/notifications/:id" element={<ProtectedRoute><NotificationDetailPage /></ProtectedRoute>} />

      {/* Supplier Admin - Protected + Supplier Role Required */}
      <Route path="/supplier" element={<ProtectedRoute requireSupplier><SupplierDashboardPage /></ProtectedRoute>} />
      <Route path="/supplier/profile" element={<ProtectedRoute requireSupplier><BusinessProfilePage /></ProtectedRoute>} />
      <Route path="/supplier/offers" element={<ProtectedRoute requireSupplier><SupplierOffersPage /></ProtectedRoute>} />
      <Route path="/supplier/offers/new" element={<ProtectedRoute requireSupplier><OfferFormPage /></ProtectedRoute>} />
      <Route path="/supplier/offers/:id/edit" element={<ProtectedRoute requireSupplier><OfferFormPage /></ProtectedRoute>} />

      {/* Owner Admin - Protected + Owner Role Required */}
      <Route path="/owner" element={<ProtectedRoute requireOwner><OwnerDashboardPage /></ProtectedRoute>} />
      <Route path="/owner/stats" element={<ProtectedRoute requireOwner><OwnerStatsPage /></ProtectedRoute>} />
      <Route path="/owner/lots" element={<ProtectedRoute requireOwner><ManageLotsPage /></ProtectedRoute>} />
      <Route path="/owner/lots/new" element={<ProtectedRoute requireOwner><LotFormPage /></ProtectedRoute>} />
      <Route path="/owner/lots/:lotId/edit" element={<ProtectedRoute requireOwner><LotFormPage /></ProtectedRoute>} />
      <Route path="/owner/campsites/new" element={<ProtectedRoute requireOwner><CampsiteCreateWizardPage /></ProtectedRoute>} />
      <Route path="/owner/property/new" element={<ProtectedRoute requireOwner><PropertyTypeSelectionPage /></ProtectedRoute>} />
      <Route path="/owner/property/new/campsite" element={<ProtectedRoute requireOwner><PropertyWizardPage propertyType="campsite" /></ProtectedRoute>} />
      <Route path="/owner/property/new/bnb" element={<ProtectedRoute requireOwner><PropertyWizardPage propertyType="bnb" /></ProtectedRoute>} />
      <Route path="/owner/property/published" element={<ProtectedRoute requireOwner><PropertyPublishSuccessPage /></ProtectedRoute>} />
      <Route path="/owner/campsites/:id/edit" element={<ProtectedRoute requireOwner><CampsiteFormPage /></ProtectedRoute>} />
      <Route path="/owner/bookings" element={<ProtectedRoute requireOwner><OwnerBookingsPage /></ProtectedRoute>} />
      <Route path="/owner/offers" element={<ProtectedRoute requireOwner><OfferManagementPage /></ProtectedRoute>} />
      <Route path="/owner/offers/new" element={<ProtectedRoute requireOwner><OfferFormPage /></ProtectedRoute>} />
      <Route path="/owner/offers/:id/edit" element={<ProtectedRoute requireOwner><OfferFormPage /></ProtectedRoute>} />
      <Route path="/owner/revenue" element={<ProtectedRoute requireOwner><RevenueDashboardPage /></ProtectedRoute>} />
      <Route path="/owner/settings" element={<ProtectedRoute requireOwner><OwnerSettingsPage /></ProtectedRoute>} />
      <Route path="/owner/settings/calendar" element={<ProtectedRoute requireOwner><OwnerCalendarSettingsPage /></ProtectedRoute>} />
      <Route path="/owner/settings/pricing" element={<ProtectedRoute requireOwner><OwnerPricingSettingsPage /></ProtectedRoute>} />
      <Route path="/owner/settings/bank" element={<ProtectedRoute requireOwner><OwnerBankSettingsPage /></ProtectedRoute>} />
      <Route path="/owner/settings/payout-schedule" element={<ProtectedRoute requireOwner><OwnerPayoutSchedulePage /></ProtectedRoute>} />
      <Route path="/owner/settings/tax" element={<ProtectedRoute requireOwner><OwnerTaxSettingsPage /></ProtectedRoute>} />
      <Route path="/owner/settings/team" element={<ProtectedRoute requireOwner><OwnerTeamSettingsPage /></ProtectedRoute>} />
      <Route path="/owner/reviews" element={<ProtectedRoute requireOwner><OwnerReviewsPage /></ProtectedRoute>} />
      <Route path="/owner/calendar" element={<ProtectedRoute requireOwner><OwnerCalendarPage /></ProtectedRoute>} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
