import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'

export default function PaymentProcessingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      // Randomly succeed or fail for demo (90% success rate)
      const success = Math.random() > 0.1
      if (success) {
        setStatus('success')
        setTimeout(() => {
          navigate(`/book/${id}/confirmation`)
        }, 1500)
      } else {
        setStatus('failed')
        setTimeout(() => {
          navigate(`/book/${id}/payment-failed`)
        }, 1500)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [id, navigate])

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col items-center justify-center p-6">
      {status === 'processing' && (
        <>
          {/* Animated loader */}
          <div className="relative size-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="credit_card" size={32} className="text-primary" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Processing Payment
          </h1>
          <p className="text-slate-500 text-center max-w-xs">
            Please wait while we securely process your payment...
          </p>

          {/* Progress steps */}
          <div className="mt-8 space-y-3 w-full max-w-xs">
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Icon name="check" size={16} className="text-white" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Verifying card details
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-primary flex items-center justify-center animate-pulse">
                <Icon name="sync" size={16} className="text-white animate-spin" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Processing with bank
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Icon name="schedule" size={16} className="text-slate-400" />
              </div>
              <span className="text-sm text-slate-400">
                Confirming booking
              </span>
            </div>
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
            <Icon name="check_circle" size={48} className="text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-500">Redirecting to confirmation...</p>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="size-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <Icon name="error" size={48} className="text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-slate-500">Redirecting to try again...</p>
        </>
      )}

      {/* Security note */}
      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-slate-400">
        <Icon name="lock" size={14} />
        <span>Secured by Stripe</span>
      </div>
    </div>
  )
}
