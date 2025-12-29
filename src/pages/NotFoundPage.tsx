import { useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'

// 404 Not Found Page
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-6">
      <div className="max-w-sm w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="explore_off" className="text-6xl text-primary" />
          </div>
        </div>

        {/* 404 Text */}
        <p className="text-7xl font-bold text-primary/30 mb-2">404</p>

        {/* Content */}
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off into the
          wilderness.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate('/')}
            leftIcon="home"
          >
            Back to Home
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="w-full h-12 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Popular Links */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">
            Maybe try one of these?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="search" className="text-primary" />
              <span className="text-sm font-medium">Search</span>
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="calendar_today" className="text-primary" />
              <span className="text-sm font-medium">Bookings</span>
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="favorite" className="text-primary" />
              <span className="text-sm font-medium">Favorites</span>
            </button>
            <button
              onClick={() => navigate('/support')}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="help" className="text-primary" />
              <span className="text-sm font-medium">Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
