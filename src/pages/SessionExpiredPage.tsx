import { useNavigate } from 'react-router-dom'
import { Icon, Button } from '@/components/ui'

// Mock M43: Session Expired Page
export function SessionExpiredPage() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-6">
      <div className="max-w-sm w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Icon name="schedule" className="text-6xl text-blue-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold mb-3">Session Expired</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          For your security, your session has expired. Please log in again to
          continue.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={handleLogin} leftIcon="login">
            Log In Again
          </Button>
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Continue as Guest
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3 text-left">
            <Icon name="shield" className="text-xl text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Why did this happen?
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Sessions expire after periods of inactivity to help protect your
                account from unauthorized access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
