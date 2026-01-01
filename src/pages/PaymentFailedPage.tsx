import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { getCampsiteById } from '../data/mockData'

export default function PaymentFailedPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const campsite = getCampsiteById(id || '')

  return (
    <AppShell showNav={false} showHeader={false}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Error Icon */}
        <div className="size-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Icon name="credit_card_off" size={48} className="text-red-500" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
          Payment Failed
        </h1>
        <p className="text-slate-500 text-center mb-6">
          We couldn't process your payment
          {campsite && (
            <>
              {' for '}
              <span className="text-primary font-medium">{campsite.name}</span>
            </>
          )}
        </p>

        {/* Possible reasons */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8">
          <p className="font-medium text-slate-900 dark:text-white mb-3">
            Possible reasons:
          </p>
          <ul className="space-y-2">
            {[
              'Insufficient funds',
              'Incorrect card details (CVV or expiry)',
              'Card issuer declined the transaction',
              'Card expired or blocked',
            ].map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Icon name="close" size={16} className="text-red-500 mt-0.5 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate(`/book/${id}/payment`)}
            rightIcon="arrow_forward"
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => navigate(`/book/${id}/payment?changeMethod=true`)}
          >
            Use Different Payment Method
          </Button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            Return to Home
          </button>
        </div>

        {/* Support link */}
        <div className="mt-8 flex items-center gap-2 text-sm">
          <Icon name="support_agent" size={18} className="text-slate-400" />
          <a href="#" className="text-primary font-medium">
            Contact Support
          </a>
        </div>
      </div>
    </AppShell>
  )
}
