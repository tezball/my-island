import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function PasswordResetSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
          <Icon name="check_circle" size={40} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Password Reset!
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>

        <div className="w-full max-w-xs">
          <Link to="/login">
            <Button className="w-full" leftIcon="login">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <div className="flex items-start gap-3">
            <Icon name="security" size={24} className="text-primary shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400 text-left">
              For your security, you have been signed out of all devices. Please sign in again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
