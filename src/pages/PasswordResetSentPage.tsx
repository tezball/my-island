import { Link, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function PasswordResetSentPage() {
  const location = useLocation()
  const email = location.state?.email || 'your email'

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
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">
          Check Your Email
        </h2>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 pb-8">
        {/* Success Illustration */}
        <div className="mb-8 relative">
          <div className="size-32 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            <Icon name="mark_email_read" size={56} className="text-primary" />
          </div>
          {/* Success checkmark badge */}
          <div className="absolute -bottom-1 -right-1 size-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Icon name="check" size={24} className="text-slate-900" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Check your inbox
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            We've sent a password reset link to{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
            Click the link in the email to reset your password.
          </p>
        </div>

        {/* Tips */}
        <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Icon name="lightbulb" size={18} className="text-yellow-500" />
            Didn't receive the email?
          </h3>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <Icon name="check_circle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              Check your spam or junk folder
            </li>
            <li className="flex items-start gap-2">
              <Icon name="check_circle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              Make sure the email address is correct
            </li>
            <li className="flex items-start gap-2">
              <Icon name="check_circle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              Wait a few minutes and try again
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Link to="/forgot-password" className="block">
            <Button variant="secondary" size="lg" className="w-full">
              Resend Email
            </Button>
          </Link>
          <Link to="/login" className="block">
            <Button variant="ghost" size="lg" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </main>

      {/* Decorative bottom bar */}
      <div className="h-2 w-full bg-gradient-to-r from-background-light via-primary/30 to-background-light dark:from-background-dark dark:via-primary/20 dark:to-background-dark" />
    </div>
  )
}
