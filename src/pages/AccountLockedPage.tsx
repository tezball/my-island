import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function AccountLockedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
          <Icon name="lock" size={40} className="text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Account Locked
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          Your account has been temporarily locked due to multiple failed login attempts.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          For your security, please wait 30 minutes before trying again or reset your password.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/forgot-password">
            <Button className="w-full" leftIcon="lock_reset">
              Reset Password
            </Button>
          </Link>

          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@myisland.ie" className="text-primary font-medium">
              support@myisland.ie
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
