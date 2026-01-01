import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Icon from '../components/ui/Icon'

type Step = 1 | 2

export default function SignUpPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)

  // Step 1: Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2: Personal Details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, text: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { level: 1, text: 'Weak', color: 'text-red-500' }
    if (score <= 3) return { level: 2, text: 'Medium', color: 'text-yellow-500' }
    if (score <= 4) return { level: 3, text: 'Strong', color: 'text-primary' }
    return { level: 4, text: 'Very Strong', color: 'text-primary' }
  }, [password])

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      handleContinue()
      return
    }

    if (!validateStep2()) return

    setIsLoading(true)
    // Mock signup - simulate API call
    setTimeout(() => {
      setIsLoading(false)
      navigate('/verify-email', { state: { email } })
    }, 1500)
  }

  const handleSocialSignup = (provider: 'google' | 'apple') => {
    navigate(`/auth/${provider}`)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 justify-between bg-transparent">
        <button
          onClick={handleBack}
          className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon name="arrow_back_ios_new" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-300'}`} />
          <div className={`size-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-300'}`} />
        </div>

        <div className="w-12" />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-8 pt-2 max-w-md mx-auto w-full">
        {step === 1 ? (
          <>
            <div className="mb-6">
              <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight mb-2 tracking-tight">
                Create account
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                Start your adventure with my-island.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Social Sign Up */}
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full relative"
                  onClick={() => handleSocialSignup('google')}
                >
                  <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full relative !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 hover:!opacity-90"
                  onClick={() => handleSocialSignup('apple')}
                >
                  <svg className="w-5 h-5 absolute left-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.75 3.37 1.74-2.92 1.63-2.38 5.76.54 7.02-.37 1.48-1.02 2.87-2.5 4.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Continue with Apple
                </Button>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
                <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm font-medium">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
              </div>

              {/* Email Input */}
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                error={errors.email}
                required
              />

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  error={errors.password}
                  required
                />
                {password && (
                  <div className="mt-1">
                    <div className="flex gap-2 h-1.5 w-full">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.level
                              ? level <= 1
                                ? 'bg-red-500'
                                : level <= 2
                                ? 'bg-yellow-500'
                                : 'bg-primary'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                      Strength: <span className={passwordStrength.color}>{passwordStrength.text}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="lg"
                error={errors.confirmPassword}
                required
              />

              <div className="h-2" />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Continue
                <Icon name="arrow_forward" size={20} className="ml-2" />
              </Button>

              <div className="text-center mt-2">
                <p className="text-slate-500 dark:text-slate-400 text-base">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight mb-2 tracking-tight">
                Personal details
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                Tell us a bit about yourself.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  size="lg"
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Murphy"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  size="lg"
                  error={errors.lastName}
                  required
                />
              </div>

              {/* Phone Input */}
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+353 87 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="lg"
              />

              {/* Checkboxes */}
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 size-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm -mt-2">{errors.terms}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptMarketing}
                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                    className="mt-1 size-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Send me camping tips, special offers, and updates (you can unsubscribe anytime)
                  </span>
                </label>
              </div>

              <div className="h-2" />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>

              <p className="text-center text-xs text-slate-400 mt-2">
                By creating an account, you agree to receive communications from my-island.
              </p>
            </form>
          </>
        )}
      </main>

      {/* Decorative gradient */}
      <div className="w-full h-32 opacity-10 pointer-events-none fixed bottom-0 left-0 bg-gradient-to-t from-primary to-transparent" />
    </div>
  )
}
