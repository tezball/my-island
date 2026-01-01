import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function ServerErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRetrying(false)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Icon name="cloud_off" size={40} className="text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Server Error
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          Something went wrong on our end. Our team has been notified.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          Please try again in a few minutes. If the problem persists, contact support.
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

          <Link to="/">
            <Button variant="secondary" className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm">
          <p className="text-xs font-medium text-slate-500 mb-2">Error Code: 500</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need help?{' '}
            <a href="mailto:support@myisland.ie" className="text-primary font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
