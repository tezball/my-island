import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'

export function PasswordResetSentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'your email'

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center p-4 justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <button
          onClick={() => navigate('/login')}
          className="flex w-12 h-12 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 -mt-10 w-full max-w-md mx-auto">
        {/* Hero Icon */}
        <div className="mb-8 relative">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl dark:bg-primary/10" />

          {/* Icon Container */}
          <div className="relative flex items-center justify-center w-32 h-32 bg-white dark:bg-surface-dark rounded-[2rem] shadow-lg border border-white dark:border-slate-700 animate-pulse">
            {/* Checkmark Badge */}
            <div className="absolute -top-1 -right-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-sm z-10">
              <Icon name="check" className="text-background-dark text-[20px]" />
            </div>
            {/* Main Icon */}
            <Icon name="mark_email_read" filled className="text-primary text-[64px]" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-4">
          Check your mail
        </h1>

        {/* Body Text */}
        <div className="max-w-[320px] mx-auto text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            We have sent password recovery instructions to{' '}
            <span className="text-slate-900 dark:text-white font-semibold">{email}</span>.
          </p>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Did not receive the email? Check your spam filter or{' '}
            <button className="text-primary font-bold hover:underline">
              try another email
            </button>.
          </p>
        </div>

        <div className="h-10" />

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button className="w-full" size="lg" leftIcon="mail">
            Open Email App
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            size="lg"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center pb-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Wrong email address?{' '}
          <Link to="/forgot-password" className="text-primary font-bold hover:underline">
            Resend email
          </Link>
        </p>
      </div>
    </div>
  )
}
