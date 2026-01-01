import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'

const scheduleOptions = [
  { id: 'daily', label: 'Daily', description: 'Receive payouts every day' },
  { id: 'weekly', label: 'Weekly', description: 'Receive payouts every Monday' },
  { id: 'biweekly', label: 'Bi-weekly', description: 'Receive payouts every 2 weeks' },
  { id: 'monthly', label: 'Monthly', description: 'Receive payouts on the 1st of each month' },
]

export default function OwnerPayoutSchedulePage() {
  const [schedule, setSchedule] = useState('weekly')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <AppShell showBack headerTitle="Payout Schedule" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Current Balance */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
            <p className="text-sm opacity-80 mb-1">Available Balance</p>
            <p className="text-3xl font-bold mb-4">€1,247.50</p>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Icon name="schedule" size={16} />
              <span>Next payout: Monday, Jan 20</span>
            </div>
          </div>
        </div>

        {/* Schedule Options */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Payout Frequency
          </h3>
          <div className="space-y-3">
            {scheduleOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSchedule(option.id)}
                className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-colors ${
                  schedule === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-left">
                  <p className={`font-medium ${
                    schedule === option.id
                      ? 'text-primary'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
                {schedule === option.id && (
                  <Icon name="check_circle" size={24} className="text-primary" filled />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Recent Payouts
          </h3>
          <div className="space-y-3">
            {[
              { date: 'Jan 13, 2025', amount: '€892.00', status: 'completed' },
              { date: 'Jan 6, 2025', amount: '€1,156.50', status: 'completed' },
              { date: 'Dec 30, 2024', amount: '€743.25', status: 'completed' },
            ].map((payout, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center">
                    <Icon name="payments" size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {payout.amount}
                    </p>
                    <p className="text-sm text-slate-500">{payout.date}</p>
                  </div>
                </div>
                <span className="text-sm text-emerald-600 font-medium">Completed</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 safe-area-pb">
        <Button className="w-full" isLoading={isSaving} onClick={handleSave} leftIcon="save">
          Save Schedule
        </Button>
      </div>
    </AppShell>
  )
}
