import { useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'

// Mock M42: Server Error Page (500)
interface ServerErrorPageProps {
  errorCode?: string
  onRetry?: () => void
}

export function ServerErrorPage({ errorCode, onRetry }: ServerErrorPageProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-6">
      <div className="max-w-sm w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <Icon name="error" className="text-6xl text-orange-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold mb-3">Something Went Wrong</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
          We're having trouble connecting to our servers. Please try again in a
          moment.
        </p>
        {errorCode && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            Error code: {errorCode}
          </p>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={onRetry} leftIcon="refresh">
            Try Again
          </Button>
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Go to Home
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-400">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm font-medium">
              We're working on fixing this
            </span>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-6 text-sm text-gray-500">
          Problem persists?{' '}
          <button
            onClick={() => navigate('/support')}
            className="text-primary font-semibold hover:underline"
          >
            Contact Support
          </button>
        </p>
      </div>
    </div>
  )
}
