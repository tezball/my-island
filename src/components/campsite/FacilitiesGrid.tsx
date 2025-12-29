import type { Facility } from '@/types'
import { Icon } from '../ui'

interface FacilitiesGridProps {
  facilities: Facility[]
  className?: string
}

export function FacilitiesGrid({ facilities, className }: FacilitiesGridProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
        Facilities
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
          >
            <Icon name={facility.icon} className="text-primary" />
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center">
              {facility.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
