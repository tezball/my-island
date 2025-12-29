import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { BookingProvider } from '@/context/BookingContext'
import { ProtectedRoute } from '@/components/auth'
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
              <Route path="/" element={<SearchPage />} />
              <Route path="/map" element={<HomePage />} />
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

              {/* User Features (Protected) */}
              <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Reviews */}
              <Route path="/booking/:id/review" element={<ReviewSubmissionPage />} />
              <Route path="/campsite/:id/reviews" element={<ReviewsListPage />} />
              <Route path="/review/:id" element={<ReviewDetailPage />} />

              {/* Profile & Settings (Protected) */}
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/profile/personal" element={<ProtectedRoute><PersonalInfoPage /></ProtectedRoute>} />
              <Route path="/profile/linked" element={<ProtectedRoute><LinkedAccountsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/settings/language" element={<ProtectedRoute><LanguageSelectionPage /></ProtectedRoute>} />
              <Route path="/support" element={<SupportPage />} />

              {/* Notifications (Protected) */}
              <Route path="/notifications" element={<ProtectedRoute><NotificationsListPage /></ProtectedRoute>} />
              <Route path="/notification/:id" element={<ProtectedRoute><NotificationDetailPage /></ProtectedRoute>} />
              <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettingsPage /></ProtectedRoute>} />

              {/* Suppliers */}
              <Route path="/supplier/:id" element={<SupplierDetailPage />} />

              {/* Owner/Admin (Protected + Owner Role) */}
              <Route path="/owner" element={<ProtectedRoute requireOwner><OwnerDashboardPage /></ProtectedRoute>} />
              <Route path="/owner/bookings" element={<ProtectedRoute requireOwner><OwnerBookingsPage /></ProtectedRoute>} />
              <Route path="/owner/booking/:id" element={<ProtectedRoute requireOwner><OwnerBookingDetailPage /></ProtectedRoute>} />
              <Route path="/owner/lots" element={<ProtectedRoute requireOwner><ManageLotsPage /></ProtectedRoute>} />
              <Route path="/owner/lots/add" element={<ProtectedRoute requireOwner><AddLotPage /></ProtectedRoute>} />
              <Route path="/owner/lots/:id/edit" element={<ProtectedRoute requireOwner><EditLotPage /></ProtectedRoute>} />
              <Route path="/owner/campsite/edit" element={<ProtectedRoute requireOwner><EditCampsitePage /></ProtectedRoute>} />
              <Route path="/owner/statistics" element={<ProtectedRoute requireOwner><CampsiteStatisticsPage /></ProtectedRoute>} />
              <Route path="/owner/offers" element={<ProtectedRoute requireOwner><SupplierOfferManagementPage /></ProtectedRoute>} />
              <Route path="/owner/offers/:id/edit" element={<ProtectedRoute requireOwner><EditOfferPage /></ProtectedRoute>} />
              <Route path="/owner/revenue" element={<ProtectedRoute requireOwner><RevenueDashboardPage /></ProtectedRoute>} />
              <Route path="/owner/settings" element={<ProtectedRoute requireOwner><OwnerSettingsPage /></ProtectedRoute>} />

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
