import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function UnverifiedEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsResending(false)
    setResent(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
          <Icon name="mark_email_unread" size={40} className="text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Email Not Verified
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          Please verify your email address to access all features of your account.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Check your inbox for a verification link. If you haven't received it, you can request a new one.
        </p>

        {resent && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl max-w-sm flex items-center gap-3">
            <Icon name="check_circle" size={24} className="text-emerald-600" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Verification email sent! Check your inbox.
            </p>
          </div>
        )}

        <div className="w-full max-w-xs space-y-3">
          <Button
            className="w-full"
            leftIcon="send"
            onClick={handleResend}
            isLoading={isResending}
            disabled={resent}
          >
            {resent ? 'Email Sent' : 'Resend Verification'}
          </Button>

          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Wrong email?{' '}
            <Link to="/signup" className="text-primary font-medium">
              Sign up with a different email
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
