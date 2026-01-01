import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function VerificationExpiredPage() {
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
          <Icon name="link_off" size={40} className="text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Verification Link Expired
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          This verification link has expired. Links are valid for 24 hours.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Request a new verification email to verify your account.
        </p>

        {resent && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl max-w-sm flex items-center gap-3">
            <Icon name="check_circle" size={24} className="text-emerald-600" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              New verification email sent!
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
      </div>
    </div>
  )
}
