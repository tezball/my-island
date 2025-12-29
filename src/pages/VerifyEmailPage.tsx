import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'your email'

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Verify Email
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 items-center px-6 pt-8 pb-6 max-w-md mx-auto">
        {/* Hero Visual */}
        <div className="w-full flex justify-center mb-8 relative">
          {/* Background blob */}
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl scale-75 transform translate-y-4" />

          <div className="relative z-10 w-48 h-48 rounded-3xl bg-surface-light dark:bg-surface-dark flex items-center justify-center shadow-sm overflow-hidden">
            <Icon name="mark_email_unread" filled className="text-primary text-[72px]" />
          </div>

          {/* Status icon */}
          <div className="absolute -bottom-3 right-[20%] bg-primary text-background-dark rounded-full p-2 border-4 border-white dark:border-background-dark shadow-lg">
            <Icon name="mail" className="text-[24px]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Check your inbox
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Almost there! We've sent a secure verification link to{' '}
            <span className="font-bold text-slate-900 dark:text-white">{email}</span>.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
            Please click the link to activate your account and start exploring campsites.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 mb-6 mt-auto">
          <Button className="w-full" size="lg" leftIcon="mail">
            Open Mail App
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => navigate('/')}
          >
            Continue to App
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="w-full text-center space-y-6">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Didn't receive the email?{' '}
            <button className="text-primary font-semibold hover:underline ml-1 inline-flex items-center gap-1 group">
              Click to resend
              <Icon name="refresh" className="text-[16px] group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
            <a className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">
              Need help? Contact Support
            </a>
          </div>
        </div>
      </div>

      <div className="h-6 w-full" />
    </div>
  )
}
