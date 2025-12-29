import { Icon } from '@/components/ui'

// Mock M44: Maintenance Page
interface MaintenancePageProps {
  estimatedTime?: string
}

export function MaintenancePage({ estimatedTime }: MaintenancePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-6">
      <div className="max-w-sm w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <Icon name="construction" className="text-6xl text-yellow-600" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold mb-3">Under Maintenance</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          We're making some improvements to give you a better experience. We'll
          be back shortly!
        </p>

        {/* Estimated Time */}
        {estimatedTime && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium mb-8">
            <Icon name="schedule" className="text-lg" />
            Expected: {estimatedTime}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* What's Happening */}
        <div className="p-4 rounded-xl bg-gray-100 dark:bg-surface-dark text-left">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Icon name="handyman" className="text-primary" />
            What we're working on:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <Icon name="check_circle" className="text-primary text-base" />
              Server performance upgrades
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check_circle" className="text-primary text-base" />
              Security enhancements
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
              Database optimization
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Questions? Contact us at{' '}
            <a
              href="mailto:support@my-island.com"
              className="text-primary font-semibold hover:underline"
            >
              support@my-island.com
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <span className="text-lg">𝕏</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <Icon name="alternate_email" />
          </button>
        </div>
      </div>
    </div>
  )
}
