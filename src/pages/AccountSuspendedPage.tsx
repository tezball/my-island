import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function AccountSuspendedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Icon name="gpp_bad" size={40} className="text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Account Suspended
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          Your account has been suspended due to a violation of our terms of service.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          If you believe this is a mistake, please contact our support team to appeal this decision.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <a href="mailto:appeals@myisland.ie?subject=Account Suspension Appeal">
            <Button className="w-full" leftIcon="mail">
              Contact Support
            </Button>
          </a>

          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl max-w-sm">
          <div className="flex items-start gap-3">
            <Icon name="info" size={20} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400 text-left">
              Suspended accounts cannot make bookings or access previous reservation details. Your data is preserved for 90 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
