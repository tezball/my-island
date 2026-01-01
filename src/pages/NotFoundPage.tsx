import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Icon name="explore_off" size={40} className="text-slate-500" />
        </div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link to="/">
            <Button className="w-full" leftIcon="home">
              Go to Home
            </Button>
          </Link>

          <Button variant="secondary" className="w-full" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>

        <div className="mt-8 space-y-2 max-w-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Popular Pages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Discover
            </Link>
            <Link to="/bookings" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              My Bookings
            </Link>
            <Link to="/favorites" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Favorites
            </Link>
            <Link to="/profile" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
