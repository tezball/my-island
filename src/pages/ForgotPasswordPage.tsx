import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Icon from '../components/ui/Icon'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      navigate('/password-reset-sent', { state: { email } })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-10">
        <Link
          to="/login"
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
        >
          <Icon name="arrow_back_ios_new" />
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-slate-900 dark:text-white opacity-0 md:opacity-100">
          Reset Password
        </h2>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-6 pt-4 pb-8">
        {/* Headline */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white mb-4">
            Forgot Password?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed">
            Don't worry! It happens. Please enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Illustration */}
        <div className="py-8 flex justify-center">
          <div className="size-32 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            <Icon name="lock_reset" size={48} className="text-primary" />
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            leftIcon="mail"
            placeholder="hello@myisland.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>

        {/* Spacer */}
        <div className="flex-1 min-h-[40px]" />

        {/* Footer Link */}
        <div className="mt-auto py-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Remember it?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors ml-1">
              Return to Login
            </Link>
          </p>
        </div>
      </main>

      {/* Decorative bottom bar */}
      <div className="h-2 w-full bg-gradient-to-r from-background-light via-primary/30 to-background-light dark:from-background-dark dark:via-primary/20 dark:to-background-dark" />
    </div>
  )
}
