import Icon from './Icon'

interface StatCardProps {
  icon: string
  value: string | number
  label: string
  trend?: number
  trendDirection?: 'up' | 'down'
  className?: string
}

export default function StatCard({
  icon,
  value,
  label,
  trend,
  trendDirection,
  className = '',
}: StatCardProps) {
  return (
    <div className={`bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-100 dark:border-slate-800 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-sm font-medium ${
            trendDirection === 'up' ? 'text-emerald-600' : 'text-red-500'
          }`}>
            <Icon
              name={trendDirection === 'up' ? 'trending_up' : 'trending_down'}
              size={16}
            />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}
