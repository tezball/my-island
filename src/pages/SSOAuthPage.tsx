import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

type AuthStatus = 'connecting' | 'success' | 'error'

export default function SSOAuthPage() {
  const { provider } = useParams<{ provider: 'google' | 'apple' }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<AuthStatus>('connecting')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Simulate SSO authentication flow
    const timer = setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.2
      if (success) {
        setStatus('success')
        setTimeout(() => {
          navigate('/welcome')
        }, 1500)
      } else {
        setStatus('error')
        setErrorMessage('Unable to connect to your account. Please try again.')
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  const providerName = provider === 'google' ? 'Google' : 'Apple'
  const providerColor = provider === 'google' ? '#4285F4' : '#000000'

  const ProviderIcon = () => {
    if (provider === 'google') {
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )
    }
    return (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.75 3.37 1.74-2.92 1.63-2.38 5.76.54 7.02-.37 1.48-1.02 2.87-2.5 4.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {status === 'connecting' && (
          <>
            {/* Animated connecting state */}
            <div className="relative mb-8">
              <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center">
                <ProviderIcon />
              </div>
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="size-28 rounded-full animate-ping opacity-20"
                  style={{ backgroundColor: providerColor }}
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connecting to {providerName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Please wait while we securely connect your account...
            </p>

            {/* Loading dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-3 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-12 text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success state */}
            <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto flex items-center justify-center mb-8">
              <Icon name="check_circle" size={48} className="text-emerald-500" filled />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connected Successfully!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Your {providerName} account has been linked. Redirecting...
            </p>

            <div className="flex justify-center">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            {/* Error state */}
            <div className="size-24 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto flex items-center justify-center mb-8">
              <Icon name="error" size={48} className="text-red-500" filled />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connection Failed
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {errorMessage}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setStatus('connecting')
                  // Retry the connection
                  setTimeout(() => {
                    setStatus('success')
                    setTimeout(() => navigate('/welcome'), 1500)
                  }, 2500)
                }}
              >
                Try Again
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/signup')}
              >
                Sign Up with Email
              </Button>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="mt-6 text-sm text-primary font-medium hover:underline"
            >
              Back to Login
            </button>
          </>
        )}
      </div>

      {/* Security badge */}
      <div className="absolute bottom-8 flex items-center gap-2 text-slate-400 text-sm">
        <Icon name="lock" size={16} />
        <span>Secured by 256-bit encryption</span>
      </div>
    </div>
  )
}
