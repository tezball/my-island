import { useLocation, useNavigate, Link } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

interface PropertySummary {
  id: string
  name: string
  propertyType: 'campsite' | 'bnb'
  location: {
    address: string
    county: string
  }
  totalUnits: number
}

export default function PropertyPublishSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const property = location.state?.property as PropertySummary | undefined

  const handleCreateAnother = (type: 'campsite' | 'bnb') => {
    navigate(`/owner/property/new/${type}`)
  }

  return (
    <AppShell showNav={false}>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Success Animation */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-once">
          <Icon name="check_circle" size={48} className="text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Property Published!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
          Your property is now live and ready to receive bookings from guests.
        </p>

        {/* Property Summary Card */}
        {property && (
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon
                  name={property.propertyType === 'bnb' ? 'hotel' : 'camping'}
                  size={24}
                  className="text-primary"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                  {property.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {property.location?.address}, {property.location?.county}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                    <Icon name="bed" size={14} />
                    {property.totalUnits} {property.totalUnits === 1 ? 'unit' : 'units'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <Link to="/owner" className="block">
            <Button className="w-full" size="lg">
              <Icon name="dashboard" size={20} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>

          {property && (
            <Link to={`/campsite/${property.id}`} className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Icon name="visibility" size={20} className="mr-2" />
                View Property
              </Button>
            </Link>
          )}
        </div>

        {/* Create Another Property Section */}
        <div className="w-full max-w-md mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
            Add Another Property
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleCreateAnother('campsite')}
              className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Icon name="camping" size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white text-sm">Campsite</span>
            </button>

            <button
              onClick={() => handleCreateAnother('bnb')}
              className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Icon name="hotel" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white text-sm">B&B</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
