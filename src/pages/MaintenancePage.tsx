import Icon from '../components/ui/Icon'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
          <Icon name="construction" size={40} className="text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Under Maintenance
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-sm">
          We're performing scheduled maintenance to improve your experience.
        </p>

        <p className="text-slate-500 text-sm mb-8 max-w-sm">
          We expect to be back online shortly. Thank you for your patience.
        </p>

        {/* Estimated time */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm mb-8">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Estimated Completion
          </p>
          <div className="flex items-center justify-center gap-2">
            <Icon name="schedule" size={24} className="text-primary" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              2:00 PM GMT
            </span>
          </div>
        </div>

        {/* What's happening */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            What We're Working On
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="speed" size={20} className="text-primary" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Performance improvements
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="security" size={20} className="text-primary" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Security updates
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="auto_awesome" size={20} className="text-primary" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                New features coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-4 bg-primary/5 rounded-xl max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Questions? Contact us at{' '}
            <a href="mailto:support@myisland.ie" className="text-primary font-medium">
              support@myisland.ie
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
