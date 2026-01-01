import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
          <Icon name="schedule" size={40} className="text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Session Expired
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          Your session has expired for security reasons.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Please sign in again to continue where you left off.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/login">
            <Button className="w-full" leftIcon="login">
              Sign In Again
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <div className="flex items-start gap-3">
            <Icon name="info" size={20} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400 text-left">
              Sessions automatically expire after 30 days of inactivity to protect your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
