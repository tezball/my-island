import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

export function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    navigate('/verify-email', { state: { email } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark relative">
      <TopAppBar showBack onBack={() => navigate(-1)} />

      <main className="flex-1 px-6 pb-8 pt-2">
        {/* Headline */}
        <div className="mb-6">
          <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight mb-2 tracking-tight">
            Create account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Start your adventure with my-island.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="relative w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-slate-700 dark:text-white font-bold text-base">
                Continue with Google
              </span>
            </button>

            <button
              type="button"
              className="relative w-full h-14 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 absolute left-5 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.606 12.37C16.606 10.15 18.232 9.176 18.334 9.115C17.257 7.55 15.589 7.377 14.99 7.357C13.568 7.214 12.227 8.21 11.516 8.21C10.784 8.21 9.686 7.316 8.527 7.336C6.983 7.357 5.56 8.23 4.767 9.613C3.12 12.472 4.36 16.66 5.926 18.917C6.699 20.015 7.614 21.235 8.832 21.194C9.99 21.154 10.458 20.442 11.882 20.442C13.305 20.442 13.732 21.194 14.972 21.174C16.273 21.154 17.087 19.995 17.839 18.877C18.734 17.595 19.1 16.335 19.12 16.253C19.08 16.233 16.606 15.297 16.606 12.37ZM14.461 5.384C15.112 4.591 15.539 3.513 15.417 2.456C14.502 2.496 13.344 3.066 12.693 3.839C12.083 4.55 11.636 5.669 11.779 6.706C12.795 6.787 13.83 5.954 14.461 5.384Z" />
              </svg>
              <span className="text-white dark:text-slate-900 font-bold text-base">
                Continue with Apple
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm font-medium">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            rightIcon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="space-y-1.5">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              rightIcon={showPassword ? 'visibility' : 'visibility_off'}
              onRightIconClick={() => setShowPassword(!showPassword)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Strength Meter */}
            <div className="mt-1">
              <div className="flex gap-2 h-1.5 w-full">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-full flex-1 rounded-full transition-colors ${
                      level <= passwordStrength.level
                        ? 'bg-primary'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                Strength: <span className="text-primary">{passwordStrength.label}</span>
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            rightIcon={showConfirmPassword ? 'visibility' : 'visibility_off'}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
            required
          />

          <div className="h-2" />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={!email || !password || password !== confirmPassword}
          >
            Create Account
          </Button>

          <div className="text-center mt-2">
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </main>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </div>
  )
}

function getPasswordStrength(password: string): { level: number; label: string } {
  if (!password) return { level: 0, label: 'None' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['Weak', 'Fair', 'Medium', 'Strong']
  return { level: score, label: labels[score - 1] || 'Weak' }
}
