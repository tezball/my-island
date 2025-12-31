import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PasswordResetSentPage from './pages/PasswordResetSentPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/password-reset-sent" element={<PasswordResetSentPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App
