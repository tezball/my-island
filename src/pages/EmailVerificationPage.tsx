import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function EmailVerificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || 'alex@example.com'

  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = async () => {
    setIsResending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsResending(false)
    setCooldown(60)
  }

  const handleOpenMail = () => {
    window.location.href = 'mailto:'
  }

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@')
    const maskedLocal = local.slice(0, 2) + '***' + local.slice(-1)
    return `${maskedLocal}@${domain}`
  }

  // Simulate verification (in real app, this would check verification status)
  useEffect(() => {
    const checkVerification = setInterval(() => {
      // Randomly verify after some time for demo
      if (Math.random() > 0.95) {
        setIsVerified(true)
      }
    }, 2000)
    return () => clearInterval(checkVerification)
  }, [])

  if (isVerified) {
    return (
      <AppShell showNav={false} showHeader={false}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
            <Icon name="check_circle" size={64} className="text-emerald-500" filled />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
            Email Verified!
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Your email has been verified. You're all set to start exploring campsites.
          </p>
          <Button className="w-full" size="lg" onClick={() => navigate('/welcome')}>
            Continue
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack headerTitle="Verify Email" showNav={false}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Email illustration */}
        <div className="relative mb-8">
          <div className="size-32 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon name="mark_email_unread" size={64} className="text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Icon name="sync" size={20} className="text-primary animate-spin" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
          Check your inbox
        </h1>
        <p className="text-slate-500 text-center mb-2">
          Almost there! We've sent a secure verification link to
        </p>
        <p className="font-medium text-slate-900 dark:text-white text-center mb-4">
          {maskEmail(email)}
        </p>
        <p className="text-sm text-slate-400 text-center mb-8">
          Please click the link to activate your account and start exploring campsites.
        </p>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button
            className="w-full"
            size="lg"
            leftIcon="mail"
            onClick={handleOpenMail}
          >
            Open Mail App
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate('/')}
          >
            Continue to App
          </Button>
        </div>

        {/* Resend link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-2">
            Didn't receive the email?
          </p>
          {cooldown > 0 ? (
            <p className="text-sm text-slate-400">
              Resend available in {cooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-2 text-primary font-medium mx-auto"
            >
              <Icon name="refresh" size={16} className={isResending ? 'animate-spin' : ''} />
              {isResending ? 'Sending...' : 'Click to resend'}
            </button>
          )}
        </div>

        {/* Support link */}
        <div className="mt-8">
          <a href="#" className="text-sm text-slate-500 hover:text-primary">
            Need help? <span className="text-primary font-medium">Contact Support</span>
          </a>
        </div>
      </div>
    </AppShell>
  )
}
