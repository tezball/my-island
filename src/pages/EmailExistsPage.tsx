import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function EmailExistsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
          <Icon name="person" size={40} className="text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Account Already Exists
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          An account with this email address already exists.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Please sign in with your existing account or use a different email to create a new one.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/login">
            <Button className="w-full" leftIcon="login">
              Sign In
            </Button>
          </Link>

          <Link to="/forgot-password">
            <Button variant="secondary" className="w-full">
              Forgot Password?
            </Button>
          </Link>

          <Link to="/signup">
            <Button variant="ghost" className="w-full">
              Use Different Email
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            If you signed up with Google or Apple, try signing in with that method instead.
          </p>
        </div>
      </div>
    </div>
  )
}
