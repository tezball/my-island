import type { Extra } from '@/types'
import { Icon, Toggle } from '../ui'

interface ExtrasToggleProps {
  extra: Extra
  selected: boolean
  onToggle: () => void
}

export function ExtrasToggle({ extra, selected, onToggle }: ExtrasToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name={extra.icon} className="text-primary" size="md" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
            {extra.name}
          </h4>
          <p className="text-xs text-slate-500">{extra.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-primary">€{extra.price}</span>
        <Toggle checked={selected} onChange={onToggle} />
      </div>
    </div>
  )
}
