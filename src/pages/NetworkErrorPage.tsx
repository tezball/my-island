import { Icon, Button } from '@/components/ui'

// Mock M41: Network Error Page
interface NetworkErrorPageProps {
  onRetry?: () => void
}

export function NetworkErrorPage({ onRetry }: NetworkErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-6">
      <div className="max-w-sm w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Icon name="wifi_off" className="text-6xl text-red-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold mb-3">No Internet Connection</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          It looks like you're offline. Please check your connection and try
          again.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={onRetry} leftIcon="refresh">
            Try Again
          </Button>
          <button className="w-full h-12 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            Work Offline
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 rounded-xl bg-gray-100 dark:bg-surface-dark">
          <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
            <Icon name="help" className="text-lg text-gray-500" />
            Troubleshooting Tips
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 text-left">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Check your WiFi or mobile data
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Restart your router or modem
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Try moving closer to your router
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
