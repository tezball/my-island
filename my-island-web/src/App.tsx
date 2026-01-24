import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { PersonalizationPage } from './pages/PersonalizationPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import { AdminGuard } from './components/auth/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminLotsPage } from './pages/admin/AdminLotsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { CampsiteDetailsPage } from './pages/CampsiteDetailsPage';
import { TripsPage } from './pages/TripsPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { SavedPage } from './pages/SavedPage';
import { PersonalDetailsPage } from './pages/profile/PersonalDetailsPage';
import { SecurityPage } from './pages/profile/SecurityPage';
import { PaymentDetailsPage } from './pages/profile/PaymentDetailsPage';
import { NotificationsPage } from './pages/profile/NotificationsPage';

// Layout wrapper to conditionally show Header/BottomNav
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavRoutes = ['/signin', '/signup', '/personalize'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNav = hideNavRoutes.includes(location.pathname) || isAdminRoute;

  // Don't render the layout wrapper at all for admin routes
  if (isAdminRoute) {
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
            </Routes>
          </Layout>

          {/* Admin Routes - Outside of Main Layout */}
          <Routes>
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="lots" element={<AdminLotsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </SavedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
