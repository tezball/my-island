import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
          <Icon name="verified" size={40} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Email Verified!
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
          Your email has been successfully verified. You now have full access to all features.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/">
            <Button className="w-full" leftIcon="explore">
              Start Exploring
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="secondary" className="w-full">
              Complete Your Profile
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-xl max-w-sm">
          <div className="flex items-start gap-3">
            <Icon name="celebration" size={24} className="text-primary shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Welcome to My Island!
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Discover amazing campsites across Ireland and book your next adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
