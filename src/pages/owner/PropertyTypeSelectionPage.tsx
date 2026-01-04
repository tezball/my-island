import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

interface PropertyTypeOption {
  type: 'campsite' | 'bnb'
  title: string
  description: string
  icon: string
  features: string[]
}

const propertyTypes: PropertyTypeOption[] = [
  {
    type: 'campsite',
    title: 'Campsite / Glamping',
    description: 'Outdoor accommodations with multiple pitch types',
    icon: 'camping',
    features: [
      'Tent pitches',
      'RV / Motorhome spots',
      'Glamping pods & yurts',
      'Cabins & cottages',
      'Mobile homes',
    ],
  },
  {
    type: 'bnb',
    title: 'Bed & Breakfast',
    description: 'Traditional B&B with guest rooms',
    icon: 'hotel',
    features: [
      'Guest bedrooms',
      'Breakfast included',
      'Private or shared bathrooms',
      'Common areas',
      'Home-style hospitality',
    ],
  },
]

export default function PropertyTypeSelectionPage() {
  const navigate = useNavigate()

  const handleSelectType = (type: 'campsite' | 'bnb') => {
    navigate(`/owner/property/new/${type}`)
  }

  return (
    <AppShell showBack headerTitle="Register Property" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="relative h-40 bg-gradient-to-br from-primary to-emerald-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Icon name="add_home" size={40} className="mb-2" />
              <h1 className="text-xl font-bold">What type of property?</h1>
              <p className="text-white/80 text-sm">Choose the option that best fits your space</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {propertyTypes.map((option) => (
            <button
              key={option.type}
              onClick={() => handleSelectType(option.type)}
              className={cn(
                'w-full text-left p-5 bg-white dark:bg-gray-800 rounded-2xl',
                'border-2 border-gray-200 dark:border-gray-700',
                'hover:border-primary dark:hover:border-primary',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={option.icon} size={28} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </h3>
                    <Icon name="arrow_forward" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
                      >
                        <Icon name="check" size={12} className="text-primary" />
                        {feature}
                      </span>
                    ))}
                    {option.features.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs text-gray-500">
                        +{option.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex gap-3">
              <Icon name="info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Not sure which to choose?</p>
                <p className="text-blue-600 dark:text-blue-400">
                  Select <strong>Campsite / Glamping</strong> if you have outdoor spaces like tent pitches,
                  RV spots, or glamping units. Choose <strong>B&B</strong> if you're offering traditional
                  guest rooms with breakfast service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
