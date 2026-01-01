import { useState } from 'react'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function NetworkErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRetrying(false)
    // In real app, would check network and reload
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Icon name="wifi_off" size={40} className="text-slate-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          No Internet Connection
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          It looks like you're offline. Please check your connection and try again.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Some features may be available offline. Your bookings and favorites are cached locally.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Button
            className="w-full"
            leftIcon="refresh"
            onClick={handleRetry}
            isLoading={isRetrying}
          >
            Try Again
          </Button>

          <Button variant="secondary" className="w-full" leftIcon="download">
            View Offline Data
          </Button>
        </div>

        <div className="mt-8 space-y-3 max-w-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Troubleshooting Tips
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="wifi" size={20} className="text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Check your WiFi or mobile data
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="flight_takeoff" size={20} className="text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Turn off airplane mode
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="router" size={20} className="text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Restart your router
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
