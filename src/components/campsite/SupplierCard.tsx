import type { LocalSupplier } from '@/types'
import { Icon, Toggle } from '../ui'

interface SupplierCardProps {
  supplier: LocalSupplier
  onToggleAlerts?: (enabled: boolean) => void
}

const categoryIcons: Record<string, string> = {
  food: 'restaurant',
  activity: 'kayaking',
  gear: 'backpack',
  other: 'store',
}

export function SupplierCard({ supplier, onToggleAlerts }: SupplierCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon
            name={categoryIcons[supplier.category] || 'store'}
            className="text-primary"
            size="md"
          />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
            {supplier.name}
          </h4>
          <span className="text-xs text-slate-500">{supplier.distance}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Alerts</span>
        <Toggle
          checked={supplier.alertsEnabled}
          onChange={(checked) => onToggleAlerts?.(checked)}
        />
      </div>
    </div>
  )
}
