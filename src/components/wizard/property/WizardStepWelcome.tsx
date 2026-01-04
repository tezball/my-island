import { usePropertyWizard } from '@/context/PropertyWizardContext'
import Icon from '@/components/ui/Icon'
import { useAuth } from '@/context/AuthContext'

const valueProps = [
  {
    icon: 'home',
    title: 'Easy Setup',
    description: 'List your property in minutes with our guided wizard',
  },
  {
    icon: 'shield',
    title: 'Secure Payments',
    description: 'Get paid directly to your bank account',
  },
  {
    icon: 'public',
    title: 'Global Reach',
    description: 'Connect with travelers from around the world',
  },
]

export function WizardStepWelcome() {
  const { nextStep, state } = usePropertyWizard()
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {state.propertyType === 'bnb'
            ? "Let's set up your B&B property"
            : "Let's set up your campsite property"}
        </p>
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl">
        {valueProps.map((prop) => (
          <div
            key={prop.title}
            className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <Icon name={prop.icon} size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {prop.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {prop.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={nextStep}
        className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors"
      >
        Start Setup
        <Icon name="arrow_forward" size={20} />
      </button>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Takes about 5-10 minutes to complete
      </p>
    </div>
  )
}

export default WizardStepWelcome
