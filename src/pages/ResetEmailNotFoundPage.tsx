import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function ResetEmailNotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Icon name="search_off" size={40} className="text-slate-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Email Not Found
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          We couldn't find an account with that email address.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Please check the email address or create a new account.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/forgot-password">
            <Button className="w-full" leftIcon="arrow_back">
              Try Different Email
            </Button>
          </Link>

          <Link to="/signup">
            <Button variant="secondary" className="w-full">
              Create Account
            </Button>
          </Link>

          <Link to="/login">
            <Button variant="ghost" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Signed up with Google or Apple?{' '}
            <Link to="/login" className="text-primary font-medium">
              Try signing in with that method
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
