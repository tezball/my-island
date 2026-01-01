import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { getCampsiteById } from '../data/mockData'

export default function BookingFailedPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const errorCode = searchParams.get('error') || '502-LOT'

  const campsite = getCampsiteById(id || '')

  const getErrorMessage = () => {
    switch (errorCode) {
      case '502-LOT':
        return 'It appears this pitch/accommodation is no longer available for your selected dates.'
      case '503-SERVICE':
        return 'We\'re experiencing technical difficulties. Please try again in a few minutes.'
      case '409-CONFLICT':
        return 'Someone else just booked this spot. Please select different dates or accommodation.'
      default:
        return 'We encountered an unexpected error while processing your booking.'
    }
  }

  return (
    <AppShell showNav={false} showHeader={false}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Error illustration */}
        <div className="relative mb-6">
          <div className="size-32 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Icon name="landscape" size={64} className="text-amber-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 size-10 rounded-full bg-amber-500 flex items-center justify-center">
            <Icon name="priority_high" size={24} className="text-white" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
          Booking Unsuccessful
        </h1>
        <p className="text-slate-500 text-center mb-4">
          {getErrorMessage()}
        </p>

        {/* Error code */}
        <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8">
          <p className="text-xs font-mono text-slate-500">
            Error code: {errorCode}
          </p>
        </div>

        {/* Campsite info */}
        {campsite && (
          <div className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-8">
            <img
              src={campsite.images[0]}
              alt={campsite.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {campsite.name}
              </p>
              <p className="text-sm text-slate-500">
                {campsite.location.county}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate(`/book/${id}/calendar`)}
          >
            Try Different Dates
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => navigate(`/campsite/${id}`)}
          >
            View Other Options
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            leftIcon="support_agent"
            onClick={() => {}}
          >
            Contact Support
          </Button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    </AppShell>
  )
}
