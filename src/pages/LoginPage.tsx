import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithProvider, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Demo accounts for testing
  const demoAccounts = [
    { label: 'Visitor (Emma Murphy)', email: 'visitor@my-island.com', password: 'demo1234', type: 'visitor' },
    { label: 'Owner: Mary Gallagher (B&B)', email: 'mary@galwaybay-guesthouse.ie', password: 'demo1234', type: 'owner' },
    { label: 'Owner: Sean O\'Donnell (2 properties)', email: 'sean@wildatlantic-glamping.ie', password: 'demo1234', type: 'owner' },
    { label: 'Owner: Aoife Brennan (Eco Retreat)', email: 'aoife@cork-eco-retreat.ie', password: 'demo1234', type: 'owner' },
    { label: 'Owner: Sarah O\'Brien (Generic)', email: 'owner@my-island.com', password: 'demo1234', type: 'owner' },
    { label: 'Supplier (Michael Kelly)', email: 'supplier@my-island.com', password: 'demo1234', type: 'supplier' },
  ]

  const handleDemoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const account = demoAccounts.find(a => a.email === e.target.value)
    if (account) {
      setEmail(account.email)
      setPassword(account.password)
      setErrors({})
      setTouched({ email: true, password: true })
    }
  }

  // Redirect if already authenticated
  const from = (location.state as { from?: string })?.from || '/'
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  // Clear auth errors when component mounts or inputs change
  useEffect(() => {
    if (authError) {
      clearError()
    }
  }, [email, password])

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email'
    return ''
  }

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }))
    }
    if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }))
    }
  }

  const isFormValid = email && password && !validateEmail(email) && !validatePassword(password)
  const isLoading = isSubmitting || authLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    setErrors({ email: emailError, password: passwordError })
    setTouched({ email: true, password: true })

    if (emailError || passwordError) return

    setIsSubmitting(true)
    try {
      await login({ email, password })
      // Navigation handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Handle specific error types
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      if (errorMessage === 'ACCOUNT_LOCKED') {
        navigate('/account-locked')
      } else if (errorMessage === 'ACCOUNT_SUSPENDED') {
        navigate('/account-suspended')
      } else if (errorMessage === 'EMAIL_UNVERIFIED') {
        navigate('/unverified-email')
      }
      // Other errors are handled by AuthContext and shown via authError
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      await loginWithProvider(provider)
      // Navigation handled by useEffect when isAuthenticated changes
    } catch {
      // Errors handled by AuthContext
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
        >
          <Icon name="arrow_back" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">my-island</h2>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pb-8">
        {/* Hero Image */}
        <div className="mt-2 mb-6 relative group overflow-hidden rounded-2xl aspect-[16/9] shadow-lg">
          <div className="absolute inset-0 bg-black/10 z-10" />
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80')`,
            }}
          />
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <Icon name="location_on" className="text-primary text-[16px]" size={16} />
            <span className="text-xs font-medium text-white tracking-wide">Connemara, Ireland</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome back<br />to camp.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Enter your details to access your dashboard.
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Demo Account Selector */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="science" size={18} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">Demo Mode</span>
            </div>
            <select
              onChange={handleDemoSelect}
              value={email || ''}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">Select a demo account...</option>
              {demoAccounts.map((account) => (
                <option key={account.email} value={account.email}>
                  {account.label} ({account.email})
                </option>
              ))}
            </select>
          </div>

          {/* Auth Error Display */}
          {authError && !['ACCOUNT_LOCKED', 'ACCOUNT_SUSPENDED', 'EMAIL_UNVERIFIED'].includes(authError) && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <Icon name="error" size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Login failed</p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {authError === 'INVALID_CREDENTIALS'
                    ? 'Invalid email or password. Please try again.'
                    : 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          )}

          <div>
            <Input
              label="Email Address"
              type="email"
              leftIcon="mail"
              placeholder="camp@my-island.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (touched.email) {
                  setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }))
                }
              }}
              onBlur={() => handleBlur('email')}
              size="lg"
              error={touched.email ? errors.email : undefined}
              required
            />
            {/* Valid indicator */}
            {email && !errors.email && touched.email && (
              <div className="flex items-center gap-1 mt-1 text-emerald-500 text-sm">
                <Icon name="check_circle" size={16} />
                <span>Valid email</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              leftIcon="lock"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (touched.password) {
                  setErrors(prev => ({ ...prev, password: validatePassword(e.target.value) }))
                }
              }}
              onBlur={() => handleBlur('password')}
              size="lg"
              error={touched.password ? errors.password : undefined}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            rightIcon={isLoading ? undefined : "arrow_forward"}
            isLoading={isLoading}
            disabled={!isFormValid && (touched.email || touched.password)}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>

          {/* Biometric Login - Hidden on web, only shown on native apps
          TODO: Implement with WebAuthn or native biometrics
          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors group"
            >
              <Icon name="face" size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Face ID</span>
            </button>
          </div>
          */}
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500 font-medium">
              Or
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="flex flex-col gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 hover:!opacity-90"
            onClick={() => handleSocialLogin('apple')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.75 3.37 1.74-2.92 1.63-2.38 5.76.54 7.02-.37 1.48-1.02 2.87-2.5 4.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-6 bg-white dark:bg-surface-dark/50 border-t border-slate-100 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Don't have an account?</span>
          <Link to="/signup" className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors">
            Sign Up
          </Link>
        </div>
      </footer>
    </div>
  )
}
