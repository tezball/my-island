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
import { OwnerDashboardPage, OwnerLotsPage, OwnerBookingsPage, OwnerCalendarPage, OwnerPropertyPage, OwnerSettingsPage, OwnerPricingPage, OwnerTodayPage, OwnerReviewsPage, OwnerStaffPage } from './pages/owner';
import { SupplierGuard } from './components/auth/SupplierGuard';
import { AdminGuard } from './components/auth/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from './pages/admin/AdminBookingDetailPage';
import { AdminOwnersPage } from './pages/admin/AdminOwnersPage';
import { AdminOwnerDetailPage } from './pages/admin/AdminOwnerDetailPage';
import { AdminSuppliersPage } from './pages/admin/AdminSuppliersPage';
import { AdminSupplierDetailPage } from './pages/admin/AdminSupplierDetailPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage';
import { AdminFinancialPage } from './pages/admin/AdminFinancialPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminLeadDetailPage } from './pages/admin/AdminLeadDetailPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { SupplierLayout } from './components/supplier/SupplierLayout';
import { SupplierDashboardPage } from './pages/supplier/SupplierDashboardPage';
import { SupplierOffersPage } from './pages/supplier/SupplierOffersPage';
import { SupplierOfferDetailPage } from './pages/supplier/SupplierOfferDetailPage';
import { SupplierRedeemPage } from './pages/supplier/SupplierRedeemPage';
import { SupplierReviewsPage } from './pages/supplier/SupplierReviewsPage';
import { SupplierProfilePage } from './pages/supplier/SupplierProfilePage';
import { SupplierSettingsPage } from './pages/supplier/SupplierSettingsPage';
import { SupplierStaffPage } from './pages/supplier/SupplierStaffPage';
import { CampsiteDetailsPage } from './pages/CampsiteDetailsPage';
import { SupplierDetailsPage } from './pages/SupplierDetailsPage';
import { TripsPage } from './pages/TripsPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { SavedPage } from './pages/SavedPage';
import { PersonalDetailsPage } from './pages/profile/PersonalDetailsPage';
import { SecurityPage } from './pages/profile/SecurityPage';
import { NotificationsPage } from './pages/profile/NotificationsPage';
import { VouchersPage } from './pages/VouchersPage';
import { OffersPage } from './pages/OffersPage';
import { ExplorePage } from './pages/ExplorePage';
import { JournalPage } from './pages/JournalPage';
import { BecomeHostPage } from './pages/supplier-onboarding';
import { BecomeSupplierPage } from './pages/supplier-business-onboarding';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { FaqPage } from './pages/FaqPage';

// Layout wrapper to conditionally show Header/BottomNav
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/personalize', '/become-a-host', '/become-a-supplier', '/verify-email'];
  const isOwnerRoute = location.pathname.startsWith('/owner');
  const isSupplierRoute = location.pathname.startsWith('/supplier');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBecomeHostRoute = location.pathname.startsWith('/become-a-host');
  const isBecomeSupplierRoute = location.pathname.startsWith('/become-a-supplier');
  const shouldHideNav = hideNavRoutes.includes(location.pathname) || isOwnerRoute || isSupplierRoute || isAdminRoute || isBecomeHostRoute || isBecomeSupplierRoute;

  // Don't render the layout wrapper at all for owner/supplier/admin/become-a-host/become-a-supplier routes
  if (isOwnerRoute || isSupplierRoute || isAdminRoute || isBecomeHostRoute || isBecomeSupplierRoute) {
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
              <Route path="/profile/notifications" element={<NotificationsPage />} />
              <Route path="/campsite/:id" element={<CampsiteDetailsPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/vouchers" element={<VouchersPage />} />
              <Route path="/marketplace" element={<OffersPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/marketplace/supplier/:id" element={<SupplierDetailsPage />} />
              <Route path="/faq" element={<FaqPage />} />
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
                <Route path="reviews" element={<OwnerReviewsPage />} />
                <Route path="property" element={<OwnerPropertyPage />} />
                <Route path="pricing" element={<OwnerPricingPage />} />
                <Route path="staff" element={<OwnerStaffPage />} />
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
                <Route path="reviews" element={<SupplierReviewsPage />} />
                <Route path="profile" element={<SupplierProfilePage />} />
                <Route path="staff" element={<SupplierStaffPage />} />
                <Route path="settings" element={<SupplierSettingsPage />} />
              </Route>
            </Route>
          </Routes>

          {/* Admin Routes - Outside of Main Layout */}
          <Routes>
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/:id" element={<AdminUserDetailPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
                <Route path="owners" element={<AdminOwnersPage />} />
                <Route path="owners/:id" element={<AdminOwnerDetailPage />} />
                <Route path="suppliers" element={<AdminSuppliersPage />} />
                <Route path="suppliers/:id" element={<AdminSupplierDetailPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
                <Route path="financial" element={<AdminFinancialPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="leads/:id" element={<AdminLeadDetailPage />} />
                <Route path="audit" element={<AdminAuditPage />} />
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
