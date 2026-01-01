import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function TokenExpiredPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
          <Icon name="timer_off" size={40} className="text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Link Expired
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          This password reset link has expired. Links are valid for 24 hours.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Please request a new password reset link.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/forgot-password">
            <Button className="w-full" leftIcon="mail">
              Request New Link
            </Button>
          </Link>

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
