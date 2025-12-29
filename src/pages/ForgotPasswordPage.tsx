import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    navigate('/password-reset-sent', { state: { email } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
        >
          <Icon name="arrow_back_ios_new" />
        </button>
        <h2 className="text-lg font-bold opacity-0 md:opacity-100">Reset Password</h2>
        <div className="w-10" />
      </div>

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-6 pt-4 pb-8">
        {/* Headline */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white mb-4">
            Forgot Password?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Don't worry! It happens. Please enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Illustration */}
        <div className="py-8 flex justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            <Icon name="lock_reset" className="text-[48px] text-primary" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <Input
            label="Email Address"
            type="email"
            placeholder="hello@myisland.com"
            leftIcon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isLoading}
            disabled={!email}
          >
            Send Reset Link
          </Button>
        </form>

        <div className="flex-1 min-h-[40px]" />

        {/* Footer */}
        <div className="mt-auto py-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Remember it?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
              Return to Login
            </Link>
          </p>
        </div>
      </main>

      {/* Decorative bottom */}
      <div className="h-2 w-full bg-gradient-to-r from-white via-primary/30 to-white dark:from-background-dark dark:via-primary/20 dark:to-background-dark" />
    </div>
  )
}
