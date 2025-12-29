import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { BookingProvider } from '@/context/BookingContext'
import {
  LoginPage,
  HomePage,
  SearchPage,
  CampsiteDetailPage,
  SelectDatesPage,
  GuestExtrasPage,
  BookingSummaryPage,
  PaymentProcessingPage,
  BookingConfirmationPage,
  MyBookingsPage,
  FavoritesPage,
  OffersPage,
  ProfilePage,
} from '@/pages'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <Routes>
              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />

              {/* Discovery */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/campsite/:id" element={<CampsiteDetailPage />} />

              {/* Booking Flow */}
              <Route path="/book/:id/dates" element={<SelectDatesPage />} />
              <Route path="/book/:id/guests" element={<GuestExtrasPage />} />
              <Route path="/book/:id/summary" element={<BookingSummaryPage />} />
              <Route path="/book/:id/payment" element={<PaymentProcessingPage />} />
              <Route path="/booking/:id/confirmed" element={<BookingConfirmationPage />} />

              {/* User Features */}
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
