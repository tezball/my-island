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
import { AdminGuard } from './components/auth/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminLotsPage } from './pages/admin/AdminLotsPage';
import { CampsiteDetailsPage } from './pages/CampsiteDetailsPage';

// Layout wrapper to conditionally show Header/BottomNav
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavRoutes = ['/signin', '/signup', '/personalize'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

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
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/personalize" element={<PersonalizationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/campsite/:id" element={<CampsiteDetailsPage />} />
            <Route path="/saved" element={<div className="p-4">Saved Pages (Coming Soon)</div>} />
            <Route path="/trips" element={<div className="p-4">Trips (Coming Soon)</div>} />
          </Routes>
        </Layout>

        {/* Admin Routes - Outside of Main Layout */}
        <Routes>
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="lots" element={<AdminLotsPage />} />
              <Route path="users" element={<div className="p-4">User Management (Coming Soon)</div>} />
              <Route path="settings" element={<div className="p-4">Settings (Coming Soon)</div>} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
