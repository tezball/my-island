import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PersonalizationPage } from './pages/PersonalizationPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import { OwnerGuard } from './components/auth/OwnerGuard';
import { OwnerLayout } from './components/owner/OwnerLayout';
import { OwnerDashboardPage, OwnerLotsPage, OwnerBookingsPage, OwnerCalendarPage, OwnerPropertyPage, OwnerSettingsPage, OwnerPricingPage, OwnerTodayPage } from './pages/owner';
import { SupplierGuard } from './components/auth/SupplierGuard';
import { SupplierLayout } from './components/supplier/SupplierLayout';
import { SupplierDashboardPage } from './pages/supplier/SupplierDashboardPage';
import { SupplierOffersPage } from './pages/supplier/SupplierOffersPage';
import { SupplierOfferDetailPage } from './pages/supplier/SupplierOfferDetailPage';
import { SupplierRedeemPage } from './pages/supplier/SupplierRedeemPage';
import { SupplierProfilePage } from './pages/supplier/SupplierProfilePage';
import { SupplierSettingsPage } from './pages/supplier/SupplierSettingsPage';
import { CampsiteDetailsPage } from './pages/CampsiteDetailsPage';
import { TripsPage } from './pages/TripsPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { SavedPage } from './pages/SavedPage';
import { PersonalDetailsPage } from './pages/profile/PersonalDetailsPage';
import { SecurityPage } from './pages/profile/SecurityPage';
import { PaymentDetailsPage } from './pages/profile/PaymentDetailsPage';
import { NotificationsPage } from './pages/profile/NotificationsPage';
import { VouchersPage } from './pages/VouchersPage';
import { OffersPage } from './pages/OffersPage';
import { BecomeHostPage } from './pages/supplier-onboarding';
import { BecomeSupplierPage } from './pages/supplier-business-onboarding';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

// Layout wrapper to conditionally show Header/BottomNav
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/personalize', '/become-a-host', '/become-a-supplier', '/verify-email'];
  const isOwnerRoute = location.pathname.startsWith('/owner');
  const isSupplierRoute = location.pathname.startsWith('/supplier');
  const isBecomeHostRoute = location.pathname.startsWith('/become-a-host');
  const isBecomeSupplierRoute = location.pathname.startsWith('/become-a-supplier');
  const shouldHideNav = hideNavRoutes.includes(location.pathname) || isOwnerRoute || isSupplierRoute || isBecomeHostRoute || isBecomeSupplierRoute;

  // Don't render the layout wrapper at all for owner/supplier/become-a-host/become-a-supplier routes
  if (isOwnerRoute || isSupplierRoute || isBecomeHostRoute || isBecomeSupplierRoute) {
    return null;
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display">
      {!shouldHideNav && <Header />}
      {children}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/personalize" element={<PersonalizationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/details" element={<PersonalDetailsPage />} />
              <Route path="/profile/security" element={<SecurityPage />} />
              <Route path="/profile/payment" element={<PaymentDetailsPage />} />
              <Route path="/profile/notifications" element={<NotificationsPage />} />
              <Route path="/campsite/:id" element={<CampsiteDetailsPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/vouchers" element={<VouchersPage />} />
              <Route path="/marketplace" element={<OffersPage />} />
            </Routes>
          </Layout>

          {/* Owner Routes - Outside of Main Layout */}
          <Routes>
            <Route element={<OwnerGuard />}>
              <Route path="/owner" element={<OwnerLayout />}>
                <Route index element={<OwnerDashboardPage />} />
                <Route path="today" element={<OwnerTodayPage />} />
                <Route path="lots" element={<OwnerLotsPage />} />
                <Route path="bookings" element={<OwnerBookingsPage />} />
                <Route path="calendar" element={<OwnerCalendarPage />} />
                <Route path="property" element={<OwnerPropertyPage />} />
                <Route path="pricing" element={<OwnerPricingPage />} />
                <Route path="settings" element={<OwnerSettingsPage />} />
              </Route>
            </Route>
          </Routes>

          {/* Supplier Routes - Outside of Main Layout */}
          <Routes>
            <Route element={<SupplierGuard />}>
              <Route path="/supplier" element={<SupplierLayout />}>
                <Route index element={<SupplierDashboardPage />} />
                <Route path="offers" element={<SupplierOffersPage />} />
                <Route path="offers/:offerId" element={<SupplierOfferDetailPage />} />
                <Route path="redeem" element={<SupplierRedeemPage />} />
                <Route path="profile" element={<SupplierProfilePage />} />
                <Route path="settings" element={<SupplierSettingsPage />} />
              </Route>
            </Route>
          </Routes>

          {/* Become a Host - Outside of Main Layout */}
          <Routes>
            <Route path="/become-a-host" element={<BecomeHostPage />} />
          </Routes>

          {/* Become a Supplier - Outside of Main Layout */}
          <Routes>
            <Route path="/become-a-supplier" element={<BecomeSupplierPage />} />
          </Routes>
        </SavedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
