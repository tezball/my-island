import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { BookingProvider } from '@/context/BookingContext'
import {
  // Auth & Onboarding
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  PasswordResetSentPage,
  SetNewPasswordPage,
  PasswordResetSuccessPage,
  VerifyEmailPage,
  OnboardingPage,
  WelcomePage,
  // Discovery
  HomePage,
  SearchPage,
  CampsiteDetailPage,
  LotCalendarPage,
  LotSelectionPage,
  PhotoGalleryPage,
  ListViewPage,
  // Booking Flow
  SelectDatesPage,
  GuestExtrasPage,
  BookingSummaryPage,
  PaymentProcessingPage,
  BookingConfirmationPage,
  PaymentMethodsPage,
  AddPaymentPage,
  PaymentFailedPage,
  BookingFailedPage,
  // Booking Management
  BookingDetailPage,
  ModifyBookingDatesPage,
  ModifyGuestExtrasPage,
  ModifyBookingSummaryPage,
  CancellationSuccessPage,
  CheckInInstructionsPage,
  ContactHostPage,
  BookingReceiptPage,
  // User Features
  MyBookingsPage,
  FavoritesPage,
  OffersPage,
  ProfilePage,
  // Reviews
  ReviewSubmissionPage,
  ReviewsListPage,
  ReviewDetailPage,
  // Profile & Settings
  EditProfilePage,
  SettingsPage,
  PersonalInfoPage,
  LinkedAccountsPage,
  SupportPage,
  LanguageSelectionPage,
  // Notifications
  NotificationsListPage,
  NotificationDetailPage,
  NotificationSettingsPage,
  // Suppliers
  SupplierDetailPage,
  // Owner/Admin
  OwnerDashboardPage,
  OwnerBookingsPage,
  OwnerBookingDetailPage,
  ManageLotsPage,
  AddLotPage,
  EditLotPage,
  EditCampsitePage,
  CampsiteStatisticsPage,
  SupplierOfferManagementPage,
  EditOfferPage,
  RevenueDashboardPage,
  OwnerSettingsPage,
  // Error States
  NetworkErrorPage,
  ServerErrorPage,
  SessionExpiredPage,
  MaintenancePage,
  NotFoundPage,
} from '@/pages'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <Routes>
              {/* Auth & Onboarding */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/password-reset-sent" element={<PasswordResetSentPage />} />
              <Route path="/set-new-password" element={<SetNewPasswordPage />} />
              <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Discovery */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/list" element={<ListViewPage />} />
              <Route path="/campsite/:id" element={<CampsiteDetailPage />} />
              <Route path="/campsite/:id/calendar" element={<LotCalendarPage />} />
              <Route path="/campsite/:id/lots" element={<LotSelectionPage />} />
              <Route path="/campsite/:id/photos" element={<PhotoGalleryPage />} />

              {/* Booking Flow */}
              <Route path="/book/:id/dates" element={<SelectDatesPage />} />
              <Route path="/book/:id/guests" element={<GuestExtrasPage />} />
              <Route path="/book/:id/summary" element={<BookingSummaryPage />} />
              <Route path="/book/:id/payment" element={<PaymentProcessingPage />} />
              <Route path="/book/:id/payment-methods" element={<PaymentMethodsPage />} />
              <Route path="/book/:id/add-payment" element={<AddPaymentPage />} />
              <Route path="/book/:id/payment-failed" element={<PaymentFailedPage />} />
              <Route path="/book/:id/failed" element={<BookingFailedPage />} />
              <Route path="/booking/:id/confirmed" element={<BookingConfirmationPage />} />

              {/* Booking Management */}
              <Route path="/booking/:id" element={<BookingDetailPage />} />
              <Route path="/booking/:id/modify/dates" element={<ModifyBookingDatesPage />} />
              <Route path="/booking/:id/modify/guests" element={<ModifyGuestExtrasPage />} />
              <Route path="/booking/:id/modify/summary" element={<ModifyBookingSummaryPage />} />
              <Route path="/booking/:id/cancelled" element={<CancellationSuccessPage />} />
              <Route path="/booking/:id/checkin" element={<CheckInInstructionsPage />} />
              <Route path="/booking/:id/contact" element={<ContactHostPage />} />
              <Route path="/booking/:id/receipt" element={<BookingReceiptPage />} />

              {/* User Features */}
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Reviews */}
              <Route path="/booking/:id/review" element={<ReviewSubmissionPage />} />
              <Route path="/campsite/:id/reviews" element={<ReviewsListPage />} />
              <Route path="/review/:id" element={<ReviewDetailPage />} />

              {/* Profile & Settings */}
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/personal" element={<PersonalInfoPage />} />
              <Route path="/profile/linked" element={<LinkedAccountsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/language" element={<LanguageSelectionPage />} />
              <Route path="/support" element={<SupportPage />} />

              {/* Notifications */}
              <Route path="/notifications" element={<NotificationsListPage />} />
              <Route path="/notification/:id" element={<NotificationDetailPage />} />
              <Route path="/settings/notifications" element={<NotificationSettingsPage />} />

              {/* Suppliers */}
              <Route path="/supplier/:id" element={<SupplierDetailPage />} />

              {/* Owner/Admin */}
              <Route path="/owner" element={<OwnerDashboardPage />} />
              <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
              <Route path="/owner/booking/:id" element={<OwnerBookingDetailPage />} />
              <Route path="/owner/lots" element={<ManageLotsPage />} />
              <Route path="/owner/lots/add" element={<AddLotPage />} />
              <Route path="/owner/lots/:id/edit" element={<EditLotPage />} />
              <Route path="/owner/campsite/edit" element={<EditCampsitePage />} />
              <Route path="/owner/statistics" element={<CampsiteStatisticsPage />} />
              <Route path="/owner/offers" element={<SupplierOfferManagementPage />} />
              <Route path="/owner/offers/:id/edit" element={<EditOfferPage />} />
              <Route path="/owner/revenue" element={<RevenueDashboardPage />} />
              <Route path="/owner/settings" element={<OwnerSettingsPage />} />

              {/* Error States */}
              <Route path="/error" element={<NetworkErrorPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="/session-expired" element={<SessionExpiredPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
